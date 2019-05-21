app.controller('overviewController', function ($scope, $http, $rootScope) {
    console.log("inside overview Controller");


    $scope.username = $rootScope.username;
    $scope.totalUsers = 0;
    $scope.read = 0;
    $scope.write = 0;
    $scope.delete = 0;
    $scope.accessData = "";
    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/access-approval",
        headers: {'Content-Type': 'application/octet-stream'},
        params: {owner: $scope.username},
        withCredentials: true
    }).then(successRequestAccessCallback, errorCallback);

    function successRequestAccessCallback(response) {
        console.log(response.data);
        for (i in response.data) {
            if (response.data[i] ["statusOfRequest"] == "approved") {
                if (response.data[i] ["accessType"] == "read") $scope.read += 1;
                if (response.data[i] ["accessType"] == "write") $scope.write += 1;
                if (response.data[i] ["accessType"] == "delete") $scope.delete += 1
            }

        }
    }

    function errorCallback(error) {
        console.log("Error in Fetching the data" + error)
    }


    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/file-accessed-others",
        headers: {'Content-Type': 'application/octet-stream'},
        params: {username: $scope.username},
        withCredentials: true
    }).then(successfileAccessCallback, errorCallback);

    function successfileAccessCallback(response) {
        console.log(response.data);
        $scope.accessData = response.data;
        var name = "";


        for (var i in $scope.accessData) {

            if ($scope.accessData[i]["username"] != name) {
                name = $scope.accessData[i]["username"];
                $scope.totalUsers = $scope.totalUsers + 1
            }
        }

    }

    function errorCallback(error) {
        console.log("Error in Fetching the data" + error)
    }


    console.log($scope.data)


});