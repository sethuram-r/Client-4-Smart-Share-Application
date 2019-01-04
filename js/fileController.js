app.controller('fileController', function ($scope,$http) {

    console.log("inside file Controller");

    $scope.data = "";
    $scope.urls = "";
    $scope.path = "Path";
    $scope.addVisible = false;
    $scope.selectedFileorFoler = "";
    $scope.contents = [];


    $scope.add = function () {
        console.log("add")
    };


    $scope.childrenFinder = function (data, path) {
        data = data["children"];
        for (var j = 0; j < data.length; j++) {
            if (data[j]["name"] == path) {
                console.log("inside");
                return data[j]
            }
        }

    };


    $scope.download = function () {

        var all_urls = [];

        var incomingCount = 0;

        var fileNameModifier = function (selectedNode, fileOrFolderPath) {

            if (!(fileOrFolderPath.includes("/"))) {
                return fileOrFolderPath
            } else {

                if (fileOrFolderPath.replace("/", " ").startsWith(selectedNode)) {
                    return fileOrFolderPath
                } else {
                    return fileOrFolderPath.substr(fileOrFolderPath.search(selectedNode), fileOrFolderPath.length)
                }
            }

        };

        var fileContent = function (param, length, zipObj, zipname) {

            console.log("inside filecontent");

            console.log(incomingCount);

            $http({
                method: "GET",
                url: "http://localhost:9000/file-server/get-object",
                headers: {'Content-Type': 'application/octet-stream'},
                params: {key: param}
            }).then(successCallback, errorCallback);

            function successCallback(response) {
                incomingCount = incomingCount + 1;
                console.log(response.data);
                var contentObj = {};
                contentObj["url"] = param;
                contentObj["data"] = response.data;
                $scope.contents.push(contentObj);


                console.log(incomingCount);
                console.log(length);

                if (incomingCount == length) {

                    // console.log($scope.contents)
                    // console.log("filename" + zipname)

                    $scope.contents.forEach(function (obj) {
                        if (zipname == "file.server.1") {
                            var filename = obj["url"]
                        } else {
                            var filename = fileNameModifier(zipname, obj["url"]);
                        }
                        zipObj.file(filename, obj["data"], {base64: true});
                    });

                    zipObj.generateAsync({type: "blob"})
                        .then(function (content) {
                            saveAs(content, zipname + ".zip");
                        });
                }
            }

            function errorCallback(error) {
                console.log("Error in Downloading" + error)
            }

        };

        if ($scope.path.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(\....)$/)) {

            $http({
                method: "GET",
                url: "http://localhost:9000/file-server/get-object",
                headers: {'Content-Type': 'application/octet-stream'},
                params: {key: $scope.path}
            }).then(function mySuccess(response) {

                var url = 'data:application/octet-stream;base64,' + response.data;
                var downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = $scope.selectedFileorFoler;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                $scope.path = "Path"
            }, function myError() {
                alert("Error in Downloading")
            });
        } else {


            var urlExtractor = function (object) {

                var temp = object;
                console.log((temp));
                for (var g in temp) {
                    console.log(temp[g]);
                    if (typeof (temp[g]) == "object") {

                        if (!("children" in temp[g])) {
                            all_urls.push(temp[g]["trueName"])
                        } else {
                            urlExtractor(temp[g]["children"])
                        }
                    }
                }
            };


            var node = $scope.data;

            if ($scope.selectedFileorFoler != "file.server.1") {
                var splittedPath = $scope.path.split("/").filter(a => a != "");

                for (var i = 0; i < splittedPath.length; i++) {
                    node = $scope.childrenFinder(node, splittedPath[i])
                }
            }
            var zip = new JSZip();
            var zipFilename = node["name"];

            all_urls.concat(urlExtractor(node["children"]));
            // console.log(all_urls)
            all_urls.forEach(function (url) {
                fileContent(url, all_urls.length, zip, zipFilename)
            })
        }


    };
    $scope.delete = function () {
        console.log("delete")
    };



    $http({
        method: "GET",
        url: "http://localhost:9000/file-server/list-objects",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        // withCredentials: true
    }).then(function mySuccess(response) {
        $scope.data = response.data;
        $scope.graph(response.data)

    }, function myError(response) {
        console.log(response)
        // window.location.replace('#!error/404/message/page not found');

    });


    var id = 0;
    $scope.graph = function (data)  {
        var tree = d3.layout.treelist()
            .childIndent(15)
            .nodeHeight(30);
        var ul = d3.select("div.tree").append("ul").classed("treelist", "true");

        function render(data, parent) {
            var nodes = tree.nodes(data),
                duration = 250;
            function toggleChildren(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else if (d._children) {
                    d.children = d._children;
                    d._children = null;
                }
            }

            var nodeEls = ul.selectAll("li.node").data(nodes, function (d) {
                d.id = d.id || ++id;
                return d.id;
            });
            //entered nodes
            var entered = nodeEls.enter().append("li").classed("node", true)
                .style("top", parent.y +"px")
                .style("opacity", 0)
                .style("height", tree.nodeHeight() + "px")
                .on("mouseover", function (d) {
                    $scope.path = d.trueName;
                    d3.select(this).classed("selected", true);
                })
                .on("mouseout", function (d) {
                    d3.selectAll(".selected").classed("selected", false);
                }).on("click", function (d) {
                    console.log(d);
                    // $scope.urls = $scope.extractUrls(d)


                    $scope.selectedFileorFoler = d.name;
                    if (d.name.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(\....)$/)) {
                        console.log("inside");
                        $scope.addVisible = true
                    } else {
                        $scope.addVisible = false
                    }

                    $scope.$apply(function () {
                        if (d.name == "file.server.1") {
                            $scope.path = "file.server.1";
                        }
                    });
                    $scope.$apply(function () {
                        if (d.name != "file.server.1") {
                            $scope.path = d.trueName;
                        }
                    });


                });
            //add arrows if it is a folder
            entered.append("span").attr("class", function (d) {
                var icon = d.children ? " glyphicon-chevron-down"
                    : d._children ? "glyphicon-chevron-right" : "";
                return "caret glyphicon " + icon;
            }).on("click", function (d) {
                toggleChildren(d);
                render(data, d);
            });
            //add icons for folder for file
            entered.append("span").attr("class", function (d) {
                if(d.children == undefined & d.value == undefined){
                    return "glyphicon " + "glyphicon-folder-close";
                }else{
                    var icon = d.children || d._children ? "glyphicon-folder-close"
                        : "glyphicon-file";
                    return "glyphicon " + icon;
                }
            });
            //add text
            entered.append("span").attr("class", "filename")
                .html(function (d) { return d.name; });
            //update caret direction
            nodeEls.select("span.caret").attr("class", function (d) {
                var icon = d.children ? " glyphicon-chevron-down"
                    : d._children ? "glyphicon-chevron-right" : "";
                return "caret glyphicon " + icon;
            });

            //update position with transition
            nodeEls.transition().duration(duration)
                .style("top", function (d) { return (d.y - tree.nodeHeight()) + "px";})
                .style("margin-left", function (d) {
                    return d.x + "px";
                })
                .style("opacity", 1);
            nodeEls.exit().remove();
        }

        render(data, data);

    };
});

