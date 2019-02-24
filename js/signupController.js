app.controller('signupController', function ($scope, $http, $rootScope) {

    console.log("inside signup Controller");
    $scope.username = "";
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.alert = false;
    $scope.change = function () {
        $scope.alert = false
    };
    $scope.submit = function () {

        console.log("clicked");

        if ($scope.username != "") {
            if ($scope.password == $scope.confirmPassword) {

                var data = $.param({
                    username: $scope.username,
                    password: $scope.password

                });

                $http({
                    method: "POST",
                    url: "http://localhost:9000/signup",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).then(function mySuccess(response) {
                    console.log(response.data);
                    if(response.data == "Legitamate User"){
                        // window.location.replace('#!');
                        $http({
                            method: "POST",
                            url: "http://localhost:9000/signin",
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: data,
                            // withCredentials: true
                        }).then(function mySuccess(response) {
                            console.log(response.data);
                            if(response.data == "Legitamate User"){
                                $rootScope.username = $scope.username;
                                window.location.replace('#!home');
                            }else if(response.statusCode == "403"){
                                window.location.replace('#!error/403/message/Access Denied');
                            }

                        }, function myError(response) {
                            console.log(response);
                            window.location.replace('#!error/404/message/page not found');

                        });

                    }else if(response.statusCode == 500){
                        window.location.replace('#!error/500/Internal server error');
                    }
                }, function myError(response) {
                    console.log(response);
                    window.location.replace('#!error/404/message/page not found');

                });
            } else {
                $scope.alert = true;
                $scope.message = "password and confirm password doesn't match";
                $scope.password = "";
                $scope.confirmPassword = ""
            }
        } else {
            $scope.alert = true;
            $scope.message = "Please fill user name"
        }

    }


});