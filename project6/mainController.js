'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial','ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/users', {
            templateUrl: 'components/user-list/user-listTemplate.html',
            controller: 'UserListController'
        }).when('/users/:userId', {
            templateUrl: 'components/user-detail/user-detailTemplate.html',
            controller: 'UserDetailController'
        }).when('/photos/:userId', {
            templateUrl: 'components/user-photos/user-photosTemplate.html',
            controller: 'UserPhotosController'
        }).otherwise({
            redirectTo: '/users'
        });
    }]);

cs142App.controller('MainController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.myName = 'Chen Zhu';
        $scope.main.buttonText = "Enable Advanced Features";
        $scope.main.versionNumber = undefined;
        $scope.main.context = "";




        $scope.main.fetchVersionNumber = function(){
            var info = $resource('test/info');
            info.get({},function(res){
                if(!res){
                    console.log("error fetching info");
                    return;
                }
                $scope.main.versionNumber = res.__v;
            });
        };
        $scope.main.fetchVersionNumber();

    }]);
