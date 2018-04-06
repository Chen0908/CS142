'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams','$resource',
  function ($scope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;


    console.log('window.cs142models.userModel($routeParams.userId)',
        window.cs142models.userModel(userId));

      $scope.selectedUser = {};

      $scope.fetchSelectedUser = function(){
          var selectedUser = $resource('/user/:id', {id:'@id'});
          selectedUser.get({id: userId},function(res){
              if(!res){
                  console.log("error fetching selecred user");
                  return;
              }
              $scope.selectedUser = res;
              $scope.main.context = "Profile of " + res.first_name + " " + res.last_name;
          });
      };

      $scope.fetchSelectedUser();

  }]);
