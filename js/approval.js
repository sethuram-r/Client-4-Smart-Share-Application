app.controller('approvalController', function ($scope, $http, $rootScope) {
    console.log("inside approval Controller");
    $scope.username = $rootScope.username;
    $scope.read = [];
    $scope.write = [];
    $scope.delete = [];
    $scope.type = "";

    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/access-approval",
        headers: {'Content-Type': 'application/octet-stream'},
        params: {owner: $scope.username},
        withCredentials: true
    }).then(successCallback, errorCallback);

    function successCallback(response) {
        console.log(response.data);
        // $scope.data = response.data
        for (i in response.data) {
            if (response.data[i] ["statusOfRequest"] == "ongoing") {
                if (response.data[i] ["accessType"] == "read") $scope.read.push(response.data[i]);
                if (response.data[i] ["accessType"] == "write") $scope.write.push(response.data[i]);
                if (response.data[i] ["accessType"] == "delete") $scope.delete.push(response.data[i])
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
    $scope.request = function (task, event) {
        console.log("inside approve");
        console.log(event.target.parentElement.parentElement.parentElement.className);
        console.log(event.target.parentElement.parentElement.parentElement);
        console.log(event.target);
        object = event.target.parentElement.parentElement.parentElement.parentElement.localName;
        record = this.m;
        delete record["$$hashKey"];
        task == "approve" ? record["status"] = task : record["status"] = "reject";
        console.log(record);
        $scope.type = record["access"];
        console.log($scope.type);
        $http({
            method: "POST",
            url: "http://localhost:9000/file-server/request-status",
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