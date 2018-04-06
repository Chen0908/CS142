'use strict';

cs142App.controller('UserPhotosController', ['$scope','mentioUtil', '$http','$routeParams', '$rootScope', '$location' ,'$resource',
    function ($scope, mentioUtil ,$http ,$routeParams, $rootScope , $location ,$resource) {
        /*
         * Since the route is specified as '/photos/:userId' in $routeProvider config the
         * $routeParams  should have the userId property set with the path from the URL.
         */
        var userId = $routeParams.userId;


        $scope.userphoto = {};
        $scope.userphoto.photos = [];
        $scope.userphoto.likeList = {};



        $scope.people = [];

        $scope.userphoto.nameMap = {};

        $scope.userphoto.mention_to = [];


        $scope.userphoto.fetchUsers = function(){
            var users = $resource('/user/list').query({}, function(res){
                if(!res){
                    console.log("error fetching users");
                    return;
                }
                for(var i = 0;i < res.length; i++){
                    if(res[i]._id !== $scope.main.currentUser._id){
                        $scope.people.push({label: res[i].first_name  + res[i].last_name});
                        $scope.userphoto.nameMap[res[i].first_name + res[i].last_name] = res[i];
                    }
                }

            });
        };

        $scope.userphoto.fetchUsers();

        $scope.mention = function(item){
            // $scope.userphoto.mention_to.push($scope.userphoto.nameMap[item.label]);
            return "@" + item.label;

        };


        $scope.userphoto.commentInputs = {};

        $scope.userphoto.fetchPhotos = function(){
            $scope.userphoto.likeList = {};
            var photoList = $resource('/photosOfUser/:id', {id:'@id'});
            photoList.query({id: userId}, function(res){
                if(!res){
                    console.log("error fetching photos");
                    return;
                }
                $scope.userphoto.photos = res;

                $scope.userphoto.photos.sort(function comp(a, b){
                   if(a.likeNum < b.likeNum){
                       return 1;
                   }
                   else if(a.likeNum > b.likeNum){
                       return -1;
                   }
                   else{
                       return new Date(b.date_time).getTime() - new Date(a.date_time).getTime();
                   }
                });

                var userInfo = $resource('/user/:id', {id:'@id'});
                userInfo.get({id:userId}, function(userRes){
                    if(!userRes){
                        console.log("error fetching user info");
                        return;
                    }
                    $scope.main.context = "Photos of " + userRes.first_name + " " + userRes.last_name;
                });
            });
        };

        $scope.userphoto.fetchPhotos();

        $scope.userphoto.hasLiked = function (photo) {


            return photo.likeUsers.indexOf($scope.main.currentUser._id) >= 0;
        };

        $scope.userphoto.submitComment = function(photo){
            var request = {comment: $scope.userphoto.commentInputs[photo._id], mention_to: $scope.userphoto.mention_to};
            var tokens = $scope.userphoto.commentInputs[photo._id].split(" ");
            for(var i = 0;i < tokens.length; i++){
                if(tokens[i] === "") {continue;}
                if(tokens[i][0] !== "@"){ continue;}
                if(tokens[i].substring(1) in $scope.userphoto.nameMap){
                    $scope.userphoto.mention_to.push($scope.userphoto.nameMap[tokens[i].substring(1)]);
                }

            }

            $http.post('/commentsOfPhoto/' + photo._id, JSON.stringify(request)).then(function successCallback(response){
                $rootScope.$broadcast("commentEvent");
                $scope.userphoto.commentInputs[photo._id] = "";

            },function errorCallback(response){
                console.log(response.data);
                alert(response.data);
            });
        };

        $scope.userphoto.submitLike = function(photo){
            var request = {photo_id: photo._id};
            $http.post('/likePhoto', JSON.stringify(request)).then(function successCallback(response){
                $rootScope.$broadcast("likeEvent");
            }, function errorCallback(response){
                console.log(response.data);
                alert(response.data);
            });
        };

        $scope.userphoto.submitUnlike = function(photo){
            var request = {photo_id: photo._id};
            $http.post('/unlikePhoto', JSON.stringify(request)).then(function successCallback(response){
                $rootScope.$broadcast("unlikeEvent");

            }, function errorCallback(response){
                console.log(response.data);
                alert(response.data);
            });

        };


        $scope.$on("commentEvent", $scope.userphoto.fetchPhotos);

        $scope.$on("loginEvent", $scope.userphoto.fetchPhotos);

        $scope.$on("newPhotoUploaded", $scope.userphoto.fetchPhotos);

        $scope.$on("logoutEvent", function(){
            $scope.userphoto = {};
            $scope.userphoto.photos = [];
            $scope.userphoto.commentInputs = {};

        });

        $scope.$on("registerEvent", $scope.userphoto.fetchPhotos);
        $scope.$on("likeEvent", $scope.userphoto.fetchPhotos);

        $scope.$on("unlikeEvent", $scope.userphoto.fetchPhotos);


    }]);
