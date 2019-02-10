app.controller('approvalController', function ($scope, $http, $rootScope) {
    console.log("inside approval Controller");
    $scope.username = $rootScope.username;
    $scope.read = [];
    $scope.write = [];
    $scope.delete = [];

    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/requested-access",
        headers: {'Content-Type': 'application/octet-stream'},
        params: {username: $scope.username, role: "owner"},
        withCredentials: true
    }).then(successCallback, errorCallback);

    function successCallback(response) {
        console.log(response.data);
        // $scope.data = response.data
        for (i in response.data) {
            if (response.data[i] ["status"] != "rejected") {
                if (response.data[i] ["access"] == "read") $scope.read.push(response.data[i]);
                if (response.data[i] ["access"] == "write") $scope.write.push(response.data[i]);
                if (response.data[i] ["access"] == "delete") $scope.delete.push(response.data[i])
            }
        }
    }

    function errorCallback(error) {
        console.log("Error in Fetching the data" + error)
    }

    $scope.filter = function (type) {
        if (type == "read") $scope.data = $scope.read;
        if (type == "write") $scope.data = $scope.write;
        if (type == "delete") $scope.data = $scope.delete

    };
    $scope.request = function (task) {
        console.log("inside approve");
        console.log(this.m);
        record = this.m;
        delete record["$$hashKey"];
        task == "approve" ? record["status"] = task : record["status"] = "reject";
        console.log(record);
        $http({
            method: "POST",
            url: "http://localhost:9000/file-server/request-status",
            data: record,
            withCredentials: true
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