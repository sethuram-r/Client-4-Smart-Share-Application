var app = angular.module('myApp', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "html/login.html"
        })
        .when("/signup", {
            templateUrl: "html/signup.html"
        })
        .when("/admin", {
            templateUrl: "html/admin.html"
        })
        .when("/home", {
            templateUrl: "html/home.html"
        })
        .when("/requests", {
            templateUrl: "html/approved.html"
        })
        .when("/waiting", {
            templateUrl: "html/requested.html"
        })
        .when("/error/:code/message/:message", {
            templateUrl: "html/error.html"
        });

});

