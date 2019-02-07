app.controller('requestedController', function ($scope, $http) {
    console.log("inside requested Controller");

    $scope.username = "reddy";
    $scope.read = 0;
    $scope.write = 0;
    $scope.delete = 0;
    $scope.data = "";

    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/requested-access",
        headers: {'Content-Type': 'application/octet-stream'},
        params: {username: $scope.username, role: "username"}
    }).then(successCallback, errorCallback);

    function successCallback(response) {
        console.log(response.data);
        $scope.data = response.data;
        for (i in response.data) {
            if (response.data[i] ["status"] == "ongoing") {
                if (response.data[i] ["access"] == "read") $scope.read += 1;
                if (response.data[i] ["access"] == "write") $scope.write += 1;
                if (response.data[i] ["access"] == "delete") $scope.delete += 1
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
            data: record
        }).then(successCallback, errorCallback);

        function successCallback(response) {
            console.log(response.data);
            location.reload();

        }

        function errorCallback(error) {
            console.log("Error in getting Lock status" + error)
        }

    };


    console.log($scope.data)


});