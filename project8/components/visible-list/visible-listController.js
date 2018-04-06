'use strict';

cs142App.controller('VisibleListController', ['$scope','$mdDialog' ,'$http', '$routeParams', '$rootScope', '$location', '$resource',
    function ($scope,$mdDialog ,$http, $routeParams, $rootScope, $location, $resource) {

        $scope.visible = {};
        $scope.visible.allUsers = [];
        $scope.visible.selectedUsers = [];
        $scope.visible.selected = {};

        $scope.visible.fetchUsers = function(){
            var users = $resource('/user/list').query({}, function(res){
                if(!res){
                    console.log("error fetching users");
                    return;
                }

                for(var i = 0;i < res.length; i++){
                    if(res[i]._id !== $scope.main.currentUser._id){
                        $scope.visible.allUsers.push(res[i]);
                    }
                }

            });
        };

        $scope.visible.fetchUsers();

        $scope.visible.cancel = function(){
            $mdDialog.cancel();
        };


        $scope.visible.submitVisible = function(){
            var flag = false;

            for( var user_id in $scope.visible.selected){

                if($scope.visible.selected.hasOwnProperty(user_id)) {
                    if ($scope.visible.selected[user_id]) {
                        $scope.visible.selectedUsers.push(user_id);
                    }
                }
            }

            $mdDialog.hide($scope.visible.selectedUsers);
        };

    }]);


