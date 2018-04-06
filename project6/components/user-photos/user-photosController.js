'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource',
    function ($scope, $routeParams, $resource) {
        /*
         * Since the route is specified as '/photos/:userId' in $routeProvider config the
         * $routeParams  should have the userId property set with the path from the URL.
         */
        var userId = $routeParams.userId;

        console.log('window.cs142models.photoOfUserModel($routeParams.userId)',
            window.cs142models.photoOfUserModel(userId));

        $scope.photo = {};
        $scope.photo.photos = [];

        $scope.photo.fetchPhotos = function(){
            var photoList = $resource('/photosOfUser/:id', {id:'@id'});
            photoList.query({id: userId}, function(res){
                if(!res){
                    console.log("error fetching photos");
                    return;
                }
                $scope.photo.photos = res;


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

        $scope.photo.fetchPhotos();


    }]);
