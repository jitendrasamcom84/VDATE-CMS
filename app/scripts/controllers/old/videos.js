'use strict';

/**
 * @ngdoc function
 * @name vdateApp.controller:MainCtrl
 * @description
 * # UserCtrl
 * Controller of the vdateApp
 */
angular.module('vdateApp')
    .controller('ProfileCtrl', function ($scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.login_user = [];
        if ($rootScope.globals && $rootScope.globals.currentUser) {
            $scope.login_user = $rootScope.globals.currentUser.data.user;
        }
    })
    .controller('ManageVideosCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, blockUI) {
        $scope.videosinfo = [];
        $scope.videos = {};
        $scope.is_edit = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        var loadVideosInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.VIDEOS).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.videosinfo = response.data;
                }
            });
        };
        loadVideosInfo();
        $scope.videos.content = "Upload Video";

        // Delete Video
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete video?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.VIDEOS, w._id).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            alertService.success("Success", "Video Deleted Successfully");
                            loadVideosInfo();
                        }
                    });
                }
            });
        };

        // Edit Videos
        $scope.editVideos = function (url) {
            $location.path(url);
        };

        $scope.videos = {};
        $scope.resspp = null;
        $scope.submit = function () {

            blockUI.start();
            if ($scope.videos.content.name) {
                upload($scope.videos.content, $scope.videos);
            } else {
                $location.path("/videos");
                alertService.error("Unable to save. Please try again")
                blockUI.stop();
            }
        };

        var updateData = function (response) {

            $scope.videos.content = $scope.videos.content.name;
            $scope.videos.content = upload_path + response.data.name;
            if ($scope.is_edit == false) {
                ApiService.putModel(ApiEndpoint.Models.VIDEOS, $scope.videos).then(function (response) {
                    if (response.is_error) {
                        blockUI.stop();
                        alertService.error(response.message);
                    } else {
                        blockUI.stop();
                        $scope.videosinfo.push($scope.videos);
                        $location.path("/videos");
                        alertService.success("Success", "Video Added Successfully");
                    }
                });
            } else {
                ApiService.postModel(ApiEndpoint.Models.VIDEOS + "/" + $routeParams.id, $scope.videos).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        $location.path("/videos");
                        alertService.success("Success", "Video Details Edit Successfully.");
                    }

                })
            }
        }
        var upload = function (file, user) {

            var data = {
                file: file
            }

            Upload.upload({
                url: ApiEndpoint.BaseUrl + 'image/upload',
                data: data,
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                if (resp.data.is_error === false) {
                    var obj = resp.data;
                    updateData(resp.data);
                }
                $scope.resspp = resp.data.data;
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        // Get edit data
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.VIDEOS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.videos = response.data;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function () {
            if ($scope.videos.content.name) {
                upload($scope.videos.content, $scope.videos);
            } else {
                ApiService.postModel(ApiEndpoint.Models.VIDEOS + "/" + $routeParams.id, $scope.videos).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        $location.path("/videos");
                        alertService.success("Success", "Video Details Edit Successfully.");
                    }
                })
            }
        };
    });  
