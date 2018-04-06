'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$http','$routeParams', '$rootScope', '$location' ,'$resource',
    function ($scope, $http ,$routeParams, $rootScope , $location ,$resource) {
        /*
         * Since the route is specified as '/photos/:userId' in $routeProvider config the
         * $routeParams  should have the userId property set with the path from the URL.
         */
        var userId = $routeParams.userId;

        console.log('window.cs142models.photoOfUserModel($routeParams.userId)',
            window.cs142models.photoOfUserModel(userId));

        $scope.userphoto = {};
        $scope.userphoto.photos = [];

        $scope.userphoto.commentInputs = {};

        $scope.userphoto.fetchPhotos = function(){
            var photoList = $resource('/photosOfUser/:id', {id:'@id'});
            photoList.query({id: userId}, function(res){
                if(!res){
                    console.log("error fetching photos");
                    return;
                }
                $scope.userphoto.photos = res;


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



        $scope.userphoto.submitComment = function(photo){
            console.log(photo);
            var request = {comment: $scope.userphoto.commentInputs[photo._id]};
            $http.post('/commentsOfPhoto/' + photo._id, JSON.stringify(request)).then(function successCallback(response){
                $rootScope.$broadcast("commentEvent");
                // $scope.userphoto.fetchPhotos();
                $scope.userphoto.commentInputs[photo._id] = "";

            },function errorCallback(response){
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

    }]);
