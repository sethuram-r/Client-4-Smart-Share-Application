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
            method: "POST",
            url: "http://localhost:9000/signin",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: data
        }).then(function mySuccess(response) {
            console.log(response.data)
            if(response.data == "Legitamate User"){
                window.location.replace('#!home');
            }else if(response.statusCode == "403"){
                window.location.replace('#!error/403/message/Access Denied');
            }

        }, function myError(response) {
            console.log(response)
            window.location.replace('#!error/404/message/page not found');

        });
    }


});