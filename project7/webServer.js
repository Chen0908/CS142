"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');

var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line
var cs142models = require('./modelData/photoApp.js').cs142models;

var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
var fs = require("fs");

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (request.session.loginUser === undefined) {
        response.status(401).send();
        return;
    }

    User.find({}, function (err, query) {
        if (err) {
            response.status(400).send(JSON.stringify(err));
            return;
        }
        var list = JSON.parse(JSON.stringify(query));
        var res = [];

        for (var i = 0; i < list.length; i++) {
            var user = {};
            user._id = list[i]._id;
            user.first_name = list[i].first_name;
            user.last_name = list[i].last_name;
            res.push(user);
        }

        response.status(200).send(res);
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (request.session.loginUser === undefined) {
        response.status(401).send();
        return;
    }
    var id = request.params.id;
    User.find({'_id': id}, function (err, query) {
        if (err) {
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (!query || query.length === 0) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        var user = JSON.parse(JSON.stringify(query[0]));

        delete user.__v;
        delete user.login_name;
        delete user.password;
        response.status(200).send(user);
    });

});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {

    if (request.session.loginUser === undefined) {
        response.status(401).send();
        return;
    }
    var id = request.params.id;

    Photo.find({user_id: id}, function (err, query) {
        if (err) {
            response.status(400).send(JSON.stringify(err));
        }
        else if (!query || query.length === 0) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not found');
        }
        else {

            var photos = JSON.parse(JSON.stringify(query));


            var processPhotos = function (photo, processPhotoCallback) {

                delete photo.__v;

                var processComment = function (comment, doneProcessComment) {
                    User.find({_id: comment.user_id}, function (err, query) {
                        if (err) {
                            console.log("Error fetching comment user info");
                            response.status(400).send(JSON.stringify(err));
                        }
                        else if (!query || query.length === 0) {
                            console.log("User of comment with _id" + comment.user_id + " not found.");
                            response.status(400).send("Not found");
                        }

                        else {
                            var user = {};
                            var queryRes = JSON.parse(JSON.stringify(query[0]));
                            user.first_name = queryRes.first_name;
                            user.last_name = queryRes.last_name;
                            user._id = queryRes._id;
                            comment.user = user;
                            delete comment.user_id;
                        }
                        doneProcessComment();
                    });

                };

                var commentCallback = function (err) {
                    if (err) {
                        response.status(400).send(JSON.stringify(err));
                    }
                    processPhotoCallback();
                };

                async.each(photo.comments, processComment, commentCallback);

            };


            var sendPhoto = function (err) {
                if (err) {
                    response.status(400).send(JSON.stringify(err));
                }
                else {
                    response.status(200).send(photos);
                }

            };

            async.each(photos, processPhotos, sendPhoto);
        }
    });


});


app.post('/admin/login', function (request, response) {
    var login_name = request.body.login_name;
    User.find({'login_name': login_name}, function (err, query) {
        if (err) {
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (!query || query.length === 0) {
            console.log('User with login name:' + login_name + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        if (request.body.password !== query[0].password) {
            console.log('Wrong password or username!');
            response.status(400).send('rong password or username');
            return;
        }

        var user = JSON.parse(JSON.stringify(query[0]));
        delete user.__v;
        request.session.loginUser = user;
        response.status(200).send(user);
    });
});

app.post('/admin/logout', function (request, response) {
    if (request.session.loginUser) {
        request.session.destroy(function (err) {
            if (err) {
                console.log(JSON.stringify(err));
                response.status(400).send(JSON.stringify(err));
            }
        });
        response.status(200).send();
    }
    else {
        response.status(400).send("No user currently logged in.");
    }
});


app.post('/commentsOfPhoto/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;
    var commentText = request.body.comment;
    Photo.findOne({_id: photo_id}, function (err, query) {
        if (err) {
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (!query) {
            console.log("Photo with id: " + photo_id + " not found.");
            response.status(400).send("Not Found");
            return;
        }
        if (!commentText || commentText === "") {
            console.log("empty comment.");
            response.status(400).send("Cannot submit empty comment!");
            return;
        }


        var newComment = {};
        newComment.user_id = request.session.loginUser._id;
        newComment.date_time = Date.now();
        newComment.comment = commentText;
        query.comments.push(newComment);
        query.save();
        response.status(200).send();

    });


});


app.post('/photos/new', function (request, response) {


    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            response.status(400).send(JSON.stringify(err));
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes

        // XXX - Do some validation here.
        if (request.file.fieldname !== "uploadedphoto") {
            console.log(request);
            response.status(400).send("wrong file");
            return;
        }

        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        var timestamp = new Date().valueOf();
        var filename = 'U' + String(timestamp) + request.file.originalname;

        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
            // XXX - Once you have the file written into your images directory under the name
            // filename you can create the Photo object in the database
            var newPhoto = {};
            newPhoto.file_name = filename;
            newPhoto.user_id = request.session.loginUser._id;
            newPhoto.date_time = Date.now();
            newPhoto.comments = [];
            Photo.create(newPhoto, function (err, newPhoto) {
                if (err) {
                    response.status(400).send("Error uploading photo");
                    console.log("Error uploading photo");
                }
                else {
                    response.status(200).send("New photo uploaded successfully");
                }
            });
        });
    });
});

app.post('/user', function (request, response) {
    var newUser = request.body;
    if (newUser.login_name === "") {
        response.status(400).send("Should enter a login_name.");
        return;
    }

    var query;

    User.find({login_name: newUser.login_name}, function (err, query) {
        if (err) {
            response.status(400).send(JSON.stringify(err));
        }
        else {
            if (query !== null && query.length !== 0) {
                response.status(400).send("login_name already exists. Please try another one");
                return;
            }

            if (newUser.first_name === "") {
                response.status(400).send("Please enter your first name.");
                return;
            }

            if (newUser.last_name === "") {
                response.status(400).send("Please enter your last name.");
                return;
            }

            if (newUser.password === "") {
                response.status(400).send("Please enter a password");
                return;
            }

            User.create(newUser, function (err, created_user) {
                if (err) {
                    response.status(400).send("Error creating account");
                    console.log("Error creating account");
                }
                else {

                    var userCopy = JSON.parse(JSON.stringify(created_user));
                    console.log(userCopy);

                    response.status(200).send(JSON.stringify(userCopy));

                }

            });

        }


    });


});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


