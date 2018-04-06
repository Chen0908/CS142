'use strict';

cs142App.controller('UserListController', ['$scope',
    function ($scope) {
        $scope.main.title = 'Users';

        console.log('window.cs142models.userListModel()', window.cs142models.userListModel());
        // $scope.allUsers = window.cs142models.userListModel();

        $scope.allUsers = undefined;
        $scope.fetchAllUsers = function () {
            $scope.FetchModel('/user/list', $scope.userListCallback);
        };

        $scope.userListCallback = function(users){
            if(!users){
                console.log("error fetching users");
                return;
            }
          $scope.$apply(function(){
              $scope.allUsers = users;

              $scope.main.context = "User List";
          });
        };
        $scope.fetchAllUsers();


    }]);



