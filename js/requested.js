app.controller('requestedController', function ($scope, $http, $rootScope) {
    console.log("inside requested Controller");

    $scope.username = $rootScope.username;
    $scope.read = 0;
    $scope.write = 0;
    $scope.delete = 0;
    $scope.data = "";

    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/requested-access",
        headers: {'Content-Type': 'application/octet-stream'},
        params: {username: $scope.username},
        withCredentials: true
    }).then(successCallback, errorCallback);

    function successCallback(response) {
        console.log(response.data);
        $scope.data = response.data;
        for (i in response.data) {
            if (response.data[i] ["statusOfRequest"] == "ongoing") {
                if (response.data[i] ["accessType"] == "read") $scope.read += 1;
                if (response.data[i] ["accessType"] == "write") $scope.write += 1;
                if (response.data[i] ["accessType"] == "delete") $scope.delete += 1
            }

        }
    }

    function errorCallback(error) {
        console.log("Error in Fetching the data" + error)
    }


    $scope.deleteRecord = function () {
        console.log(this.m);
        record = this.m;
        delete record["$$hashKey"];
        console.log(record);
        $http({
            method: "POST",
            url: "http://localhost:9000/file-server/delete-record",
            data: record,
            withCredentials: true
        }).then(successCallback, errorCallback);

        function successCallback(response) {
            console.log(response.data);
            location.replace("#!/admin");

        }

        function errorCallback(error) {
            console.log("Error in getting Lock status" + error)
        }

    };


    console.log($scope.data)


});