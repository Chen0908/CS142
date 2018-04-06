"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

var mentionSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId, // who mentioned you
    date_time:{type: Date, default: Date.now} ,
    first_name: String,
    last_name: String,
    photo_file: {type:String, default: ""},
    photo_user_id: mongoose.Schema.Types.ObjectId,
    photo_public: {type: Boolean, default: true},
    photo_permissions: {type: [mongoose.Schema.Types.ObjectId], default:[]}
});

var photoSchema = new mongoose.Schema({
    file_name: String, // 	Name of a file containing the actual photo (in the directory project6/images).
    date_time: {type: Date, default: Date.now}, // 	The date and time when the photo was added to the database
    user_id: mongoose.Schema.Types.ObjectId, // The ID of the user who created the photo.
    commentCnt: Number // Array of comment objects representing the comments made on this photo.


});



// create a schema
var userSchema = new mongoose.Schema({
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
    location: String,    // Location  of the user.
    description: String,  // A brief user description
    occupation: String,    // Occupation of the user.
    login_name: String,
    password: String,
    mentioned_by: {type: [mentionSchema], default: []},
    mostRecentPhoto: photoSchema,
    mostCommentPhoto: photoSchema
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
