app.controller('errorController', function ($scope,$routeParams) {

    $scope.code = $routeParams["code"]
    $scope.message = $routeParams["message"]

});
