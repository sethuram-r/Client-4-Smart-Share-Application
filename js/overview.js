app.controller('overviewController', function ($scope, $http) {
    console.log("inside overview Controller");


    $scope.username = "sethuram";
    $scope.totalUsers = 0;
    $scope.read = 0;
    $scope.write = 0;
    $scope.delete = 0;
    $scope.accessData = "";
    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/requested-access",
        headers: {'Content-Type': 'application/octet-stream'},
        params: {username: $scope.username, role: "username"}
    }).then(successCallback, errorCallback);

    function successCallback(response) {
        console.log(response.data);
        for (i in response.data) {
            if (response.data[i] ["status"] == "approved") {
                if (response.data[i] ["access"] == "read") $scope.read += 1;
                if (response.data[i] ["access"] == "write") $scope.write += 1;
                if (response.data[i] ["access"] == "delete") $scope.delete += 1
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
        params: {username: $scope.username}
    }).then(successCallback, errorCallback);

    function successCallback(response) {
        console.log(response.data);
        $scope.accessData = response.data

    }

    function errorCallback(error) {
        console.log("Error in Fetching the data" + error)
    }


    console.log($scope.data)


});