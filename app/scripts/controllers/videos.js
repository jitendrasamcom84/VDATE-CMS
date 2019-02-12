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
    .controller('ManageVideosCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, $route, AddressService, $location, api, blockUI, DTOptionsBuilder, DTColumnDefBuilder, $http, $window) {
        $scope.videosinfo = [];
        $scope.videoDataInfo = [];
        $scope.videoNotification = [];
        $scope.videos = {};
        $scope.is_edit = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        $scope.buttonShow = false;
        $scope.ShowPopup = false;
        $scope.ClosePopup = false;
        $scope.user_id = $rootScope.globals.currentUser.data.user;
        var loadVideosInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.VIDEOS, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.videosinfo = response.data.data;
                    for (var i = 0; i < $scope.videosinfo.length; i++) {
                        if ($scope.videosinfo[i].content != "") {
                            $scope.videoDataInfo.push($scope.videosinfo[i]);
                        }
                    }
                    $scope.loading = false;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                }
            });
        };
        loadVideosInfo();

        var loadVideosNotification = function (message) {

            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "type": "addvideo",
                    "is_approved": false,
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.videoNotification = response.data.data;
                }
            })
        }
        loadVideosNotification();

        $scope.videos.content = "Upload Video";

        $scope.GetVimeoVideos = function (content) {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: ApiEndpoint.VimeoUrl + content,
                headers: { 'Authorization': 'bearer 11cf921a741a14b0289e8ab1b09bfbe2', "Content-Type": "application/json", "Accept": "application/vnd.vimeo.*+json;version=3.4" }
            }).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.vimeoinfo = response.data.files[0].link;
                    $scope.loading = false;
                    $window.open(response.data.files[0].link, '_blank');
                }
            });
        };


        $scope.change = function () {
            // console.log('video', $scope.videos.content);
            if ($scope.videos.content) {
                upload($scope.videos.content, $scope.videos);
            }
        }

        /* Upload Video */
        var upload = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    return false;
            }
            Upload.upload({
                url: ApiEndpoint.BaseUrl + 'image/video',
                data: data,
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json'
                }
            }).then(function (resp) {

                if (resp.data.is_error === false) {
                    var obj = resp.data.data;
                    if ($scope.is_edit == false) {
                        $scope.videos.content = obj.video_url;
                        $scope.videos.thumb_url = obj.thumb_url;
                        // console.log('$scope.videos.thumb_url', $scope.videos.thumb_url);
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        // Edit Videos
        $scope.editVideos = function (url) {
            $location.path(url);
        };

        $scope.videos = {};
        $scope.resspp = null;
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.VIDEOS, $scope.videos).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    // console.log('response', response.data);
                    $scope.videosinfo.push($scope.videos);
                    $location.path("/videos");
                    alertService.success("Success", "Video Added Successfully");
                }
            });
        };

        var updateData = function (response) {

            $scope.videos.content = $scope.videos.content.name;
            $scope.videos.content = upload_path + response.data.name;
            if ($scope.is_edit == false) {
                ApiService.putModel(ApiEndpoint.Models.VIDEOS, $scope.videos).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
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


        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
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

        // Approve Video
        $scope.approveVideo = function (v) {
            $scope.loading = true;
            if (v.is_approve == false) {
                var json = {
                    "VideoId": v._id,
                    "content": v.content,
                    "is_approve": true
                }
            } else if (v.is_approve == true) {
                var json = {
                    "VideoId": v._id,
                    "content": v.content,
                    "is_approve": false
                }
            }
            ApiService.postModelWQ(ApiEndpoint.Models.VIDEO_APPROVE, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    if (v.is_approve == true) {
                        alertService.success("Success", "Video Disapprove Successfully.");
                        $scope.messageData = v;
                        $scope.sendNotification('הסרטון לא אושר');
                        $scope.loading = false;
                    } else if (v.is_approve == false) {
                        alertService.success("Success", "Video Approve Successfully.");
                        $scope.messageData = v;
                        $scope.sendNotification('הסרטון שלך אושר ועלה בהצלחה לאתר');
                        $scope.loading = false;

                    }
                    $route.reload();
                }
            })
        };

        $scope.sendNotification = function (message) {

            var json = {
                "user_id": $scope.user_id,
                "friend_id": $scope.messageData.user_id._id,
                "type": "video_approve",
                "message": message
            }
            ApiService.putModel(ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    // alertService.success("Success", "Message send Successfully.");
                }
            })
        }

        // Edit data
        $scope.editSubmit = function () {
            ApiService.postModel(ApiEndpoint.Models.VIDEOS + "/" + $routeParams.id, $scope.videos).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $location.path("/videos");
                    alertService.success("Success", "Video Details Edit Successfully.");
                }
            })
        };

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
                            window.location.reload();
                            // loadVideosInfo();
                        }
                    });
                }
            });
        };

        // Delete Video Notification
        $scope.deleteVideoNotification = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete video notification?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.VIDEOS, w._id).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            alertService.success("Success", "Video Deleted Successfully");
                            window.location.reload();
                            // loadVideosInfo();
                        }
                    });
                }
            });
        };

        /* Message Popup */
        $scope.openpopup = function (data) {
            $scope.ShowPopup = !$scope.ShowPopup;
            $scope.ClosePopup = false;
            $scope.messageData = data;
            $scope.message = '';
        }

        $scope.hidePopup = function () {
            $scope.ClosePopup = !$scope.ClosePopup;
            $scope.ShowPopup = !$scope.ShowPopup;

        }

        $scope.sendMessage = function (message) {
            if (message == null || message == '' || message.trim() == '') {
                alertService.error('Please Enter Message');
                return false;
            }
            var json = {
                "user_id": $scope.user_id,
                "friend_id": $scope.messageData.user_id._id,
                "type": "adminvideomessage",
                "message": message
            }
            ApiService.putModel(ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.hidePopup();
                    alertService.success("Success", "Message send Successfully.");
                }
            })
        }

    });  
