'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$window',
    function ($scope, $routeParams, $window) {
        /*
         * Since the route is specified as '/photos/:userId' in $routeProvider config the
         * $routeParams  should have the userId property set with the path from the URL.
         */
        var userId = $routeParams.userId;

        console.log('window.cs142models.photoOfUserModel($routeParams.userId)',
            window.cs142models.photoOfUserModel(userId));

        $scope.photo = {};
        $scope.photo.photos = undefined;
        $scope.photo.currentPhoto = undefined;
        $scope.photo.counters = 0;


        $scope.photo.fetchPhotos = function() {
            $scope.FetchModel('/photosOfUser/' + userId, $scope.photo.userPhotoCallback);
        };

        $scope.photo.userPhotoCallback = function(photos){
            if(!photos){
                console.log("error fetching photos");
                return;
            }
            $scope.$apply(function(){
               $scope.photo.photos = photos;
               if(photos && photos.length > 0){
                   $scope.photo.currentPhoto = photos[0];
               }

               $scope.FetchModel('/user/' + userId, function(user){
                   if(!user){
                       console.log("error fetching user");
                       return;
                   }
                   $scope.$apply(function(){
                       $scope.main.context = "Photos of " + user.first_name + " " + user.last_name;
                   });

               });
            });
        };

        $scope.photo.fetchPhotos();

        $scope.photo.goLeft = function(){
            if($scope.photo.counters === 0){
                $window.alert("Already the first one:)");
            }
            else{
                $scope.photo.counters -= 1;
            }
            $scope.photo.currentPhoto = $scope.photo.photos[$scope.photo.counters];
        };

        $scope.photo.goRight = function(){
            if($scope.photo.counters === $scope.photo.photos.length - 1){
                $window.alert("Already the last one:)");
            }
            else{
                $scope.photo.counters += 1;
            }
            $scope.photo.currentPhoto = $scope.photo.photos[$scope.photo.counters];
        };

    }]);
