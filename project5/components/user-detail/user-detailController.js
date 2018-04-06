'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;


    console.log('window.cs142models.userModel($routeParams.userId)',
        window.cs142models.userModel(userId));


      $scope.selectedUser = undefined;

      $scope.fetchSelectedUser = function(){
          $scope.FetchModel('/user/' + userId, $scope.userDetailCallback);
      };


      $scope.userDetailCallback = function(user){
          if(!user){
              console.log("error fetching user");
              return;
          }
          $scope.$apply(function(){
              $scope.selectedUser = user;

              $scope.main.context = "Profile of " + user.first_name + " " + user.last_name;
          });
      };

      $scope.fetchSelectedUser();

  }]);
