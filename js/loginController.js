app.controller('loginController', function ($scope,$http) {

    console.log("inside login Controller")
    $scope.username = ""
    $scope.password = ""
    $scope.submit = function () {

        console.log("clicked")

        var data = $.param({
            username:$scope.username,
            password: $scope.password

        })

        $http({
            method : "POST",
            url : "http://localhost:5000/live",
            data: data
        }).then(function mySuccess(response) {
            console.log(response.data)

        }, function myError(response) {
            console.log(response)

        });
        console.log( $scope.username )
    }


});