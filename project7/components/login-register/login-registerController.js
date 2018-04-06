'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$http', '$routeParams', '$rootScope', '$location', '$resource',
    function ($scope, $http, $routeParams, $rootScope, $location, $resource) {
        $scope.main.context = "Log in";

        $scope.login = {};

        $scope.login.returnUser = true;

        $scope.login.submitLogin = function () {
            var request = {login_name: $scope.login.login_name, password: $scope.login.password};
            $http.post('/admin/login', JSON.stringify(request)).then(function successCallback(response) {

                $scope.main.currentUser = response.data;
                $rootScope.$broadcast('loginEvent');
                $location.path("/users/" + response.data._id);


            }, function errorCallback(response) {
                console.log(response.data);
                $scope.main.currentUser = undefined;
                alert("Wrong username or password");
                $location.path('/login-register');
                $scope.login.login_name = "";
                $scope.login.password = "";
            });
        };


        $scope.login.new_user = {
            login_name: "", password: "", confirm_password: "",
            first_name: "", last_name: "",
            location: "", description: "", occupation: ""
        };




        $scope.login.register_me = function () {
            $scope.login.returnUser = false;
        };


        $scope.login.resetForm = function(){
            $scope.login.new_user = {
                login_name: "", password: "", confirm_password: "",
                first_name: "", last_name: "",
                location: "", description: "", occupation: ""
            };

        };


        $scope.login.submitRegister = function () {

            if($scope.login.new_user.login_name === ""){
                alert("login name cannot be empty.");
                $scope.login.resetForm();
                return;
            }

            if($scope.login.new_user.first_name === ""){
                alert("first name cannot be empty.");
                $scope.login.resetForm();
                return;
            }

            if($scope.login.new_user.last_name === ""){
                alert("last name cannot be empty.");
                $scope.login.resetForm();
                return;
            }


            if($scope.login.new_user.password === ""){
                alert("password cannot be empty.");
                $scope.login.resetForm();
                return;
            }

            if($scope.login.new_user.password !== $scope.login.new_user.confirm_password){
                alert("Passwords mismatch!");
                $scope.login.resetForm();
                return;
            }

            var user = {login_name: $scope.login.new_user.login_name, password: $scope.login.new_user.password,
                first_name: $scope.login.new_user.first_name, last_name: $scope.login.new_user.last_name,
                location: $scope.login.new_user.location, description: $scope.login.new_user.description,
                occupation: $scope.login.new_user.occupation};


            $http.post('/user', JSON.stringify(user)).then(function successCallback(response) {

                // $scope.main.currentUser = response.data;
                // $location.path("users/" + response.data._id);
                $rootScope.$broadcast("registerEvent");
                alert("Registration Success!");
                $scope.login.resetForm();
                $scope.login.returnUser = true;


            }, function errorCallback(response) {
                console.log(response.data);
                $scope.main.currentUser = undefined;
                alert(response.data);
                $scope.login.resetForm();
            });



        };


    }]);
