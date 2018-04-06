'use strict';

cs142App.controller('UserListController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.main.title = 'Users';

        console.log('window.cs142models.userListModel()', window.cs142models.userListModel());
        // $scope.allUsers = window.cs142models.userListModel();

        $scope.allUsers = [];
        $scope.userPhotoCount = 0;
        $scope.userCommentCount = 0;

        $scope.fetchUsers = function(){
            var users = $resource('/user/list').query({}, function(res){
                if(!res){
                    console.log("error fetching users");
                    return;
                }
               $scope.allUsers = res;
               $scope.main.context = "User List";

            });
        };

        $scope.fetchUsers();

    }]);



