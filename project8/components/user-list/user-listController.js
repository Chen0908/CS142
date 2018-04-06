'use strict';

cs142App.controller('UserListController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.main.title = 'Users';

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

        // $scope.fetchUsers();

        $scope.$on("loginEvent", $scope.fetchUsers);

        $scope.$on("commentEvent",$scope.fetchUsers);

        $scope.$on("newPhotoUploaded", $scope.fetchUsers);

        $scope.$on("registerEvent", $scope.fetchUsers);

        $scope.$on("logoutEvent", function(){
            $scope.allUsers = [];
            $scope.userPhotoCount = 0;
            $scope.userCommentCount = 0;
        });

    }]);



