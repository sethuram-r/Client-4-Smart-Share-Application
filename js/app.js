var app = angular.module('myApp', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            // templateUrl: "html/login.html"
            templateUrl: "html/home.html"
        })
        .when("/signup", {
            templateUrl: "html/signup.html"
        }).when("/home", {
        templateUrl: "html/home.html"
    }).when("/error/:code/message/:message", {
        templateUrl: "html/error.html"
    });

});

