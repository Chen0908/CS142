'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial']);

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

cs142App.controller('MainController', ['$scope',
    function ($scope) {
        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.myName = 'Chen Zhu';
        $scope.main.advanced = false;
        $scope.main.buttonText = "Enable Advanced Features";
        $scope.main.versionNumber = undefined;
        $scope.main.context = "";

        $scope.main.setAdvanced = function(){
            if($scope.main.advanced){
                $scope.main.buttonText = "Enable Advanced Features";
            }
            else{
                $scope.main.buttonText = "Disable Advanced Features";
            }
            $scope.main.advanced = !$scope.main.advanced;
        };

        $scope.FetchModel = function (url, doneCallback) {
            var xhttp = new XMLHttpRequest();
            if(!xhttp){
                return;
            }
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    doneCallback(JSON.parse(this.responseText));
                }
            };
            try {
                xhttp.open("GET", url, true);
                xhttp.send();
            }
            catch (e){
                console.log(e.toString());
            }
        };

        $scope.main.fetchVersionNumber = function(){
            $scope.FetchModel('/test/info/', $scope.main.verCallback);
        };

        $scope.main.verCallback = function(info){
            $scope.$apply(function(){
                $scope.main.versionNumber = info.__v;
            });
        };
        $scope.main.fetchVersionNumber();

    }]);
