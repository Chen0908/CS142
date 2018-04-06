'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource','mentio']);

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
        }).when('/login-register', {
            templateUrl: 'components/login-register/login-registerTemplate.html',
            controller: 'LoginRegisterController'
        }).otherwise({
            redirectTo: '/users'
        });
    }]);

cs142App.controller('MainController', ['$scope','$mdDialog' ,'$rootScope', '$location', '$http', '$resource',
    function ($scope,$mdDialog ,$rootScope, $location, $http, $resource) {
        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.myName = 'Chen Zhu';
        $scope.main.buttonText = "Enable Advanced Features";
        $scope.main.versionNumber = undefined;
        $scope.main.context = "";

        $scope.main.currentUser = undefined;

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ($scope.main.currentUser === undefined) {
                if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                    $location.path("/login-register");
                }
            }
        });

        $scope.main.logout = function () {
            $http.post('/admin/logout').then(function successCallback(response){
                $scope.main.currentUser = undefined;
                $rootScope.$broadcast("logoutEvent");
                $location.path("/login-register");
            }, function errorCallback(response){
                alert(response.data);
                console.log(response);
            });
        };

        $scope.main.fetchVersionNumber = function () {
            var info = $resource('test/info');
            info.get({}, function (res) {
                if (!res) {
                    console.log("error fetching info");
                    return;
                }
                $scope.main.versionNumber = res.__v;
            });
        };


        $scope.main.fetchVersionNumber();


        $scope.main.showAdvanced = function() {
            $mdDialog.show({
                controller: 'VisibleListController',
                scope: $scope.$new(),
                templateUrl: 'components/visible-list/visible-listTemplate.html',
                parent: angular.element(document.body)
            })
                .then(function(selectedUsers) {
                    var selected = true;
                    $scope.main.uploadPhoto(selected, selectedUsers);
                }, function() {
                    var selected = false;
                    var selectedUsers = [];
                    $scope.main.uploadPhoto(selected, selectedUsers);
                });
        };

        $scope.main.submitPhoto = function(){
            if($scope.main.inputFileNameSelected()){
                $scope.main.showAdvanced();
            }

        };


        var selectedPhotoFile;
        $scope.main.inputFileNameChanged = function (element) {
            selectedPhotoFile = element.files[0];

        };


        $scope.main.inputFileNameSelected = function () {
            return !!selectedPhotoFile;
        };

        $scope.main.uploadPhoto = function (selected, selectedUsers) {
            if (!$scope.main.inputFileNameSelected()) {
                console.error("uploadPhoto called will no selected file");
                return;
            }
            console.log('fileSubmitted', selectedPhotoFile);

            // Create a DOM form and add the file to it under the name uploadedphoto


            var domForm = new FormData();
            domForm.append('uploadedphoto', selectedPhotoFile);
            domForm.append('selected', selected);
            domForm.append('selected_users', selectedUsers);

            // Using $http to POST the form
            $http.post('/photos/new', domForm, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function successCallback(response){
                // The photo was successfully uploaded. XXX - Do whatever you want on success.
                $rootScope.$broadcast("newPhotoUploaded");
                $location.path('/photos/' + $scope.main.currentUser._id);

            }, function errorCallback(response){
                // Couldn't upload the photo. XXX  - Do whatever you want on failure.
                alert(response.data);
                console.error('Could\'t not upload the photo', response);
            });

        };

        // $scope.$on("logoutEvent", function(){$scope.main.versionNumber = undefined;});
        //
        // $scope.$on("loginEvent", $scope.main.fetchVersionNumbe);
        //
        // $scope.$on("commentEvent",$scope.main.fetchVersionNumbe);
        //
        // $scope.$on("newPhotoUploaded", $scope.main.fetchVersionNumbe);

    }]);
