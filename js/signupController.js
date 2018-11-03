app.controller('signupController', function ($scope, $http) {

    console.log("inside signup Controller")
    $scope.username = ""
    $scope.password = ""
    $scope.confirmPassword = ""
    $scope.alert = false
    $scope.change = function () {
        $scope.alert = false
    }
    $scope.submit = function () {

        console.log("clicked")

        if ($scope.username != "") {
            if ($scope.password == $scope.confirmPassword) {

                var data = $.param({
                    username: $scope.username,
                    password: $scope.password

                })

                $http({
                    method: "POST",
                    url: "http://localhost:5000/signup",
                    data: data
                }).then(function mySuccess(response) {
                    console.log(response.data)

                }, function myError(response) {
                    console.log(response)

                });
            } else {
                $scope.alert = true
                $scope.message = "password and confirm password doesn't match"
                $scope.password = ""
                $scope.confirmPassword = ""
            }
        } else {
            $scope.alert = true
            $scope.message = "Please fill user name"
        }

    }


});