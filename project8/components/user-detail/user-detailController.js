'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams','$resource',
  function ($scope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;


      $scope.selectedUser = {};
      $scope.photos = [];


      $scope.fetchSelectedUser = function(){
          var selectedUser = $resource('/user/:id', {id:'@id'});
          selectedUser.get({id: userId},function(res){
              if(!res){
                  console.log("error fetching selected user");
                  return;
              }
              console.log("detail res");
              console.log(res);
              $scope.selectedUser = res;
              $scope.main.context = "Profile of " + res.first_name + " " + res.last_name;


          });

      };

      $scope.fetchSelectedUser();


      $scope.$on("loginEvent", $scope.fetchSelectedUser);

      $scope.$on("commentEvent",$scope.fetchSelectedUser);

      $scope.$on("newPhotoUploaded", $scope.fetchSelectedUser);

      $scope.$on("logoutEvent", function(){
          $scope.selectedUser = {};
      });

      $scope.$on("registerEvent", $scope.fetchSelectedUser);



  }]);
