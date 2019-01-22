app.controller('fileController', function ($scope,$http) {

    console.log("inside file Controller");

    $scope.data = "";
    $scope.urls = "";
    $scope.path = "Path";
    $scope.addVisible = false;
    $scope.selectedFileorFoler = "";

    $scope.files = [];





    $scope.childrenFinder = function (data, path) {
        data = data["children"];
        for (var j = 0; j < data.length; j++) {
            if (data[j]["name"] == path) {
                console.log("inside");
                return data[j]
            }
        }

    };

    $('#inputGroupFile02').on('change', function () {
        console.log("inside");
        //get the file name
        var temp = $(this).val().split("\\");
        var fileName = temp[temp.length - 1];
        //replace the "Choose a file" label
        $('.custom-file-label').html(fileName)
        // $(this).next('.custom-file-label').html(fileName);
    });


    $scope.upload = function () {

        console.log($scope.selectedFileorFoler);

        if ($scope.selectedFileorFoler == undefined) {
            alert("please select the folder")
        } else {

            var temp = $scope.files;

            console.log($scope.files);

            temp.forEach(function (file) {
                if ("uploadId" in file) delete file["uploadId"];
            });

            $http({
                method: "POST",
                url: "http://localhost:9000/file-server/upload-object",
                data: temp
            }).then(function mySuccess(response) {
                console.log(response.data);
                if (response.data = "Success") {
                    $('#uploadModal').modal('hide');
                    location.reload();
                }

            }, function myError(error) {
                console.log(error);
                alert("Error in Uploading")
            });
        }

    };


    $("#inputGroupFolder").change(function (e) {
        console.log("change");
        console.log(e.target.files);
        console.log($scope.selectedFileorFoler);

        var selectedFolder = $scope.selectedFileorFoler + "/";


        var temp = {};
        temp["file"] = "";
        temp["name"] = "";
        if ($scope.selectedFileorFoler == "file.server.1") {
            temp["path"] = e.target.files[0].webkitRelativePath.replace(e.target.files[0].name, "").trim()
        } else {
            temp["path"] = selectedFolder + e.target.files[0].webkitRelativePath.replace(e.target.files[0].name, "").trim()
        }
        $scope.files.push(temp);
        console.log($scope.files);
        var uploadedFiles = e.target.files;
        Array.from(uploadedFiles).forEach(file => {
            console.log((file));
            var fileName = file.name;
            var path = file.webkitRelativePath;
            var reader = new FileReader();

            if (fileName == ".DS_Store") {
                var temp = {};
                temp["file"] = "";
                temp["name"] = "";
                if ($scope.selectedFileorFoler == "file.server.1") {
                    temp["path"] = path.replace(fileName, "").trim()
                } else {
                    temp["path"] = selectedFolder + path.replace(fileName, "").trim()
                }
                $scope.files.push(temp)
            } else {
                reader.readAsDataURL(file);
                reader.onload = function () {
                    if (reader.result) {
                        var temp = {};
                        temp["file"] = reader.result.split(',')[1];
                        temp["name"] = file.name;
                        if ($scope.selectedFileorFoler == "file.server.1") {
                            temp["path"] = path.replace(fileName, "").trim()
                        } else {
                            temp["path"] = selectedFolder + path.replace(fileName, "").trim()
                        }
                        $scope.files.push(temp)
                    }
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }


        })
        
    });


    var initialUpload = function () {
        //jQuery plugin
        (function ($) {

            $.fn.uploader = function () {

                var uploadId = 1;

                //create and add the file list and the hidden input list
                var fileList = $('<ul class="list-group"></ul>');
                $('.card-header').after(fileList);
                //when choosing a file, add the name to the list and copy the file input into the hidden inputs

                $('.file-chooser__input').on('change', function () {


                    if ($(this).val() != "") {
                        console.log($(this)[0].files[0]["name"]);
                        $scope.fileName = $(this)[0].files[0]["name"];

                        var reader = new FileReader();
                        reader.readAsDataURL($(this)[0].files[0]);
                        reader.onload = function () {
                            console.log(reader.result);


                            var temp = {};

                            temp["uploadId"] = uploadId;
                            temp["file"] = reader.result.split(',')[1];
                            temp["name"] = $scope.fileName;
                            if ($scope.selectedFileorFoler == "file.server.1") {
                                temp["path"] = "";
                            } else {
                                temp["path"] = $scope.selectedFileorFoler + "/";
                            }

                            $scope.files.push(temp);

                            // var temp = $(this).val().split("\\")
                            var fileName = $scope.fileName;
                            $('.file-chooser').append($('.file-chooser__input').clone({withDataAndEvents: true}));

                            //add the name and a remove button to the list-group
                            $('.list-group').append('<li  class="list-group-item" ><span class="list-group__name">' + fileName + '</span><button class="removal-button"  data-uploadid="' + uploadId + '"></button></li>');
                            $('.list-group').find("li:last").show(700);
                            //removal button handle

                            $('.removal-button').on('click', function (e) {
                                e.preventDefault();

                                var listId = $(this).data('uploadid');
                                var temp = $scope.files.filter(function (file) {
                                    return file["uploadId"] != listId
                                });
                                $scope.files = temp;

                                //remove the name from list-group that corresponds to the button clicked
                                $(this).parent().hide("puff").delay(10).queue(function () {
                                    $(this).remove();
                                });

                                //if the list is now empty, change the text back
                                if ($scope.files.length === 0) {
                                    $('.card-header').text("No files selected. Please select a file.");
                                    $('.custom-file-label').html("Choose File")
                                }
                            });

                            //so the event handler works on the new "real" one
                            $('.file-chooser__input').removeClass('file-chooser__input').attr('data-uploadId', uploadId);

                            //update the message area
                            $('.card-header').text("List of Files to Upload");

                            uploadId++;
                        };
                        reader.onerror = function (error) {
                            console.log('Error: ', error);
                        };


                    } else {
                        $('.custom-file-label').html("Choose File")
                    }
                });
            };
        }(jQuery));

//init
        $(document).ready(function () {
            $('.fileUploader').uploader({
                MessageAreaText: "No files selected. Please select a file."
            });
        });

    };

    initialUpload();


    $scope.download = function () {
        var all_urls = [];
        $scope.contents = [];

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
            // console.log(incomingCount);

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


                if (incomingCount == length) {

                    // console.log($scope.contents)

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

        if ($scope.path.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(\..*)$/)) {

            console.log("inside if");
            $http({
                method: "GET",
                url: "http://localhost:9000/file-server/get-object",
                headers: {'Content-Type': 'application/octet-stream'},
                params: {key: $scope.path}
            }).then(function mySuccess(response) {
                console.log($scope.selectedFileorFoler);
                var url = 'data:application/octet-stream;base64,' + response.data;
                download(url, $scope.selectedFileorFoler, "text/plain");
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
            console.log(all_urls);
            all_urls.forEach(function (url) {
                fileContent(url, all_urls.length, zip, zipFilename)
            })
        }


    };


    $scope.delete = function () {
        console.log("delete");
        $scope.allUrls = [];

        var deleteUrlExtractor = function (temp) {

            for (var g in temp) {
                var dict = {};
                if (!("children" in temp[g])) {
                    dict["Key"] = temp[g]["trueName"];
                    $scope.allUrls.push(dict)
                } else {
                    dict["Key"] = temp[g]["trueName"];
                    $scope.allUrls.push(dict);
                    deleteUrlExtractor(temp[g]["children"])
                }
            }
        };

        var node = $scope.data;
        console.log($scope.selectedFileorFoler);

        if ($scope.selectedFileorFoler != "file.server.1") {
            var splittedPath = $scope.path.split("/").filter(a => a != "");
            for (var i = 0; i < splittedPath.length; i++) {
                node = $scope.childrenFinder(node, splittedPath[i])
            }
        }

        var dict = {};
        dict["Key"] = node["trueName"];
        $scope.allUrls.push(dict);
        deleteUrlExtractor(node["children"]);
        console.log($scope.allUrls);

        $http({
            method: "POST",
            url: "http://localhost:9000/file-server/delete-object",
            data: {'Objects': $scope.allUrls}
        }).then(function mySuccess(response) {
            console.log(response.data);
            if (response.data = "Success") {
                location.reload();
            }

        }, function myError(error) {
            console.log(error);
            alert("Error in Deleting")
        });
    };


// Function to load Graph or File Structure

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
                    d3.select(this).classed("selected", true);
                })
                .on("mouseout", function (d) {
                    d3.selectAll(".selected").classed("selected", false);
                }).on("click", function (d) {
                    console.log(d);
                    // $scope.urls = $scope.extractUrls(d)

                    $scope.path = d.trueName;
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
                var icon = d.children ? " fa-angle-down"
                    : d._children ? "fa-angle-right" : "";
                return "fas " + icon;
            }).on("click", function (d) {
                toggleChildren(d);
                render(data, d);
            });
            //add icons for folder for file
            entered.append("span").attr("class", function (d) {
                if(d.children == undefined & d.value == undefined){
                    return "fas " + "fa-folder-close";
                }else{
                    var icon = d.children || d._children ? "fa-folder-open"
                        : "fa-file";
                    return "fas " + icon;
                }
            });
            //add text
            entered.append("span").attr("class", "filename")
                .html(function (d) { return d.name; });
            //update caret direction
            nodeEls.select("span").attr("class", function (d) {
                var icon = d.children ? " fa-angle-down"
                    : d._children ? "fa-angle-right" : "";
                return "fas" + icon;
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

