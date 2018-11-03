var app = angular.module('myApp', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "html/login.html"
        })
        .when("/signup", {
            templateUrl: "html/signup.html"
        });

});

