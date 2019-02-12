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
    .controller('HelpCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.helpinfo = [];
        $scope.is_edit = false;
        $scope.loading = true;
        $scope.editvideo = false;
        $scope.editquestion = false;
        $scope.editcv = false;
        $scope.editprofile = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        $scope.help = {};
        $scope.name = 'video'
        $scope.userData = $rootScope.globals.currentUser.data.user;
        var loadHelpInfo = function () {
            var json = {
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.HELP, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.helpinfo = response.data.data;
                    for (var i = 0; i < $scope.helpinfo.length; i++) {
                        if ($scope.helpinfo[i].type == 'video') {
                            $scope.videos = $scope.helpinfo[i];
                            $scope.video_date = $scope.helpinfo[i].last_updated;
                            $scope.latest_date = $scope.helpinfo[i].last_updated;
                            $scope.user_added = $scope.helpinfo[i].user.firstname;
                            $scope.useradded = $scope.helpinfo[i].user.firstname;
                            for (var j = 0; j < $scope.videos.video.length; j++) {
                                $scope.videos.firstvideo = $scope.videos.video[0];
                                $scope.videos.firsts_video = $scope.videos.video[0];
                                $scope.videos.secondvideo = $scope.videos.video[1];
                                $scope.videos.secondsss_video = $scope.videos.video[1];
                            }
                            $scope.is_edit = true;
                        } else if ($scope.helpinfo[i].type == 'question') {
                            $scope.question = $scope.helpinfo[i];
                            $scope.question_date = $scope.helpinfo[i].last_updated;
                            $scope.user_added = $scope.helpinfo[i].user.firstname;
                            for (var j = 0; j < $scope.videos.video.length; j++) {
                                $scope.question.firstvideo = $scope.question.video[0];
                                $scope.question.firsts_video = $scope.question.video[0];
                                $scope.question.secondvideo = $scope.question.video[1];
                                $scope.question.secondsss_video = $scope.question.video[1];
                            }
                        } else if ($scope.helpinfo[i].type == 'cv') {
                            $scope.cv = $scope.helpinfo[i];
                            $scope.cv_date = $scope.helpinfo[i].last_updated;
                            $scope.user_added = $scope.helpinfo[i].user.firstname;
                            for (var j = 0; j < $scope.videos.video.length; j++) {
                                $scope.cv.firstvideo = $scope.cv.video[0];
                                $scope.cv.firsts_video = $scope.cv.video[0];
                                $scope.cv.secondvideo = $scope.cv.video[1];
                                $scope.cv.secondsss_video = $scope.cv.video[1];
                            }
                        } else if ($scope.helpinfo[i].type == 'profile') {
                            $scope.profile = $scope.helpinfo[i];
                            $scope.profile_date = $scope.helpinfo[i].last_updated;
                            $scope.user_added = $scope.helpinfo[i].user.firstname;
                            for (var j = 0; j < $scope.videos.video.length; j++) {
                                $scope.profile.firstvideo = $scope.profile.video[0];
                                $scope.profile.firsts_video = $scope.profile.video[0];
                                $scope.profile.secondvideo = $scope.profile.video[1];
                                $scope.profile.secondsss_video = $scope.profile.video[1];
                            }
                        }
                    }
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };
        loadHelpInfo();

        var videos = document.getElementsByTagName("video"),
            fraction = 0.8;
        var checkScroll = function () {

            for (var i = 0; i < videos.length; i++) {

                var video = videos[i];

                var x = video.offsetLeft, y = video.offsetTop, w = video.offsetWidth, h = video.offsetHeight, r = x + w, //right
                    b = y + h, //bottom
                    visibleX, visibleY, visible;

                visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
                visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

                visible = visibleX * visibleY / (w * h);

                if (visible > fraction) {
                    video.play();
                } else {
                    video.pause();
                }

            }

        }

        window.addEventListener('scroll', checkScroll, false);
        window.addEventListener('resize', checkScroll, false);



        /* Video Start */
        $scope.change = function () {
            $scope.firstsVideo = $scope.videos.firsts_video;
            $scope.videos.firsts_video = '';
            $scope.videoloading = true;
            var first_video = $scope.videos.firstvideo;
            $scope.videos.firstvideo = $scope.videos.firsts_video;
            if (first_video) {
                upload(first_video, $scope.videos);
            } else {
                $scope.videoloading = false;
                $scope.videos.firstvideo = $scope.firstsVideo;
                $scope.videos.firsts_video = $scope.firstsVideo;
            }
        }

        // Upload Photo
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
                    $scope.videoloading = false;
                    $scope.videos.firstvideo = $scope.firstsVideo;
                    $scope.videos.firsts_video = $scope.firstsVideo;
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
                        $scope.videos.firstvideo = obj.video_url;
                        $scope.videos.firsts_video = obj.video_url;
                        $scope.videoloading = false;
                    } else {
                        $scope.videos.firstvideo = obj.video_url;
                        $scope.videos.firsts_video = obj.video_url;
                        $scope.videoloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        $scope.secondvideoChange = function () {
            $scope.secondsssVideo = $scope.videos.firsts_video;
            $scope.videos.secondsss_video = '';
            $scope.secondvideoloading = true;
            var second_video = $scope.videos.secondvideo;
            $scope.videos.secondvideo = $scope.videos.secondsss_video;
            if (second_video) {
                uploadsecond(second_video, $scope.videos);
            } else {
                $scope.secondvideoloading = false;
                $scope.videos.secondvideo = $scope.secondsssVideo;
                $scope.videos.secondsss_video = $scope.secondsssVideol;
            }
        }

        var uploadsecond = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    $scope.secondvideoloading = false;
                    $scope.videos.secondvideo = $scope.secondsssVideo;
                    $scope.videos.secondsss_video = $scope.secondsssVideol;
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
                        $scope.videos.secondvideo = obj.video_url;
                        $scope.videos.secondsss_video = obj.video_url;
                        $scope.secondvideoloading = false;
                    } else {
                        $scope.videos.secondvideo = obj.video_url;
                        $scope.videos.secondsss_video = obj.video_url;
                        $scope.secondvideoloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        /* End Video */

        /* Questionnarie Start */

        $scope.QueFirstVideochange = function () {
            $scope.question.firsts_video = '';
            $scope.questionloading = true;
            var first_video = $scope.question.firstvideo;
            $scope.question.firstvideo = $scope.question.firsts_video;
            if (first_video) {
                Quesupload(first_video, $scope.question);
            }
        }

        var Quesupload = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    $scope.questionloading = false;
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
                        $scope.question.firstvideo = obj.video_url;
                        $scope.question.firsts_video = obj.video_url;
                        $scope.questionloading = false;
                    } else {
                        $scope.question.firstvideo = obj.video_url;
                        $scope.question.firsts_video = obj.video_url;
                        $scope.questionloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };


        $scope.QueSecondVideochange = function () {
            $scope.question.secondsss_video = '';
            $scope.quesecondvideoloading = true;
            var second_video = $scope.question.secondvideo;
            $scope.question.secondvideo = $scope.question.secondsss_video;
            if (second_video) {
                Queuploadsecond(second_video, $scope.question);
            }
        }

        var Queuploadsecond = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    $scope.quesecondvideoloading = false;
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
                        $scope.question.secondvideo = obj.video_url;
                        $scope.question.secondsss_video = obj.video_url;
                        $scope.quesecondvideoloading = false;
                    } else {
                        $scope.question.secondvideo = obj.video_url;
                        $scope.question.secondsss_video = obj.video_url;
                        $scope.quesecondvideoloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        /* Questionnarie End */

        /* CV Start */

        $scope.CVFirstVideochange = function () {
            $scope.cv.firsts_video = '';
            $scope.cvloading = true;
            var first_video = $scope.cv.firstvideo;
            $scope.cv.firstvideo = $scope.cv.firsts_video;
            if (first_video) {
                CVupload(first_video, $scope.cv);
            }
        }

        var CVupload = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    $scope.cvloading = false;
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
                        $scope.cv.firstvideo = obj.video_url;
                        $scope.cv.firsts_video = obj.video_url;
                        $scope.cvloading = false;
                    } else {
                        $scope.cv.firstvideo = obj.video_url;
                        $scope.cv.firsts_video = obj.video_url;
                        $scope.cvloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        $scope.CVSecondVideochange = function () {
            $scope.cv.secondsss_video = '';
            $scope.cvsecondvideoloading = true;
            var second_video = $scope.cv.secondvideo;
            $scope.cv.secondvideo = $scope.cv.secondsss_video;
            if (second_video) {
                CVuploadsecond(second_video, $scope.cv);
            }
        }

        var CVuploadsecond = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    $scope.cvsecondvideoloading = false;
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
                        $scope.cv.secondvideo = obj.video_url;
                        $scope.cv.secondsss_video = obj.video_url;
                        $scope.cvsecondvideoloading = false;
                    } else {
                        $scope.cv.secondvideo = obj.video_url;
                        $scope.cv.secondsss_video = obj.video_url;
                        $scope.cvsecondvideoloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        /* CV End */

        /* Profile Start */

        $scope.ProfileFirstVideochange = function () {
            $scope.profile.firsts_video = '';
            $scope.profileloading = true;
            var first_video = $scope.profile.firstvideo;
            $scope.profile.firstvideo = $scope.profile.firsts_video;
            if (first_video) {
                Profileupload(first_video, $scope.profile);
            }
        }

        var Profileupload = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    $scope.profileloading = false;
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
                        $scope.profile.firstvideo = obj.video_url;
                        $scope.profile.firsts_video = obj.video_url;
                        $scope.profileloading = false;
                    } else {
                        $scope.profile.firstvideo = obj.video_url;
                        $scope.profile.firsts_video = obj.video_url;
                        $scope.profileloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        $scope.ProfileSecondVideochange = function () {
            $scope.profile.secondsss_video = '';
            $scope.profilesecondvideoloading = true;
            var second_video = $scope.profile.secondvideo;
            $scope.profile.secondvideo = $scope.profile.secondsss_video;
            if (second_video) {
                Profileuploadsecond(second_video, $scope.profile);
            }
        }

        var Profileuploadsecond = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'video/mp4':
                case 'video/webm':
                    break;
                default:
                    alertService.error('Only mp4 or webm video formats are allowed');
                    $scope.profilesecondvideoloading = false;
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
                        $scope.profile.secondvideo = obj.video_url;
                        $scope.profile.secondsss_video = obj.video_url;
                        $scope.profilesecondvideoloading = false;
                    } else {
                        $scope.profile.secondvideo = obj.video_url;
                        $scope.profile.secondsss_video = obj.video_url;
                        $scope.profilesecondvideoloading = false;
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        /* Profile End */


        $scope.typeName = function (name) {
            $scope.name = name;
            if ($scope.name == 'video') {
                $scope.latest_date = $scope.video_date;
                $scope.useradded = $scope.user_added;
                $scope.editquestion = false;
                $scope.editcv = false;
                $scope.editprofile = false;
                loadHelpInfo();
            } else if ($scope.name == 'question') {
                $scope.latest_date = $scope.question_date;
                $scope.useradded = $scope.user_added;
                $scope.editvideo = false;
                $scope.editcv = false;
                $scope.editprofile = false;
                loadHelpInfo();
            } else if ($scope.name == 'cv') {
                $scope.latest_date = $scope.cv_date;
                $scope.useradded = $scope.user_added;
                $scope.editquestion = false;
                $scope.editvideo = false;
                $scope.editprofile = false;
                loadHelpInfo();
            } else if ($scope.name == 'profile') {
                $scope.latest_date = $scope.profile_date;
                $scope.useradded = $scope.user_added;
                $scope.editvideo = false;
                $scope.editquestion = false;
                $scope.editcv = false;
                loadHelpInfo();
            }
        }

        $scope.editable = function () {
            if ($scope.editvideo != true) {
                if ($scope.name == 'video') {
                    $scope.editvideo = true;
                }
            } else {
                $scope.editvideo = false;
            }
            if ($scope.editquestion != true) {
                if ($scope.name == 'question') {
                    $scope.editquestion = true;
                }
            } else {
                $scope.editquestion = false;
            }
            if ($scope.editcv != true) {
                if ($scope.name == 'cv') {
                    $scope.editcv = true;
                }
            } else {
                $scope.editcv = false;
            }
            if ($scope.editprofile != true) {
                if ($scope.name == 'profile') {
                    $scope.editprofile = true;
                }
            } else {
                $scope.editprofile = false;
            }
        }




        // Add Help
        $scope.videosubmit = function (id) {
            $scope.videos.video = [];
            $scope.videos.video.push($scope.videos.firstvideo);
            $scope.videos.video.push($scope.videos.secondvideo);

            if (!id) {
                var json = {
                    "type": 'video',
                    "content": $scope.videos.content,
                    "title": $scope.videos.title,
                    "video": $scope.videos.video,
                    "user": $scope.userData._id,
                }
                ApiService.putModel(ApiEndpoint.Models.HELP, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editvideo = false;
                        alertService.success("Success", "Video Added Successfully.");
                    }
                })
            } else {
                var json = {
                    "type": 'video',
                    "content": $scope.videos.content,
                    "title": $scope.videos.title,
                    "video": $scope.videos.video,
                    "user": $scope.userData._id
                }
                ApiService.postModel(ApiEndpoint.Models.HELP + '/' + id, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editvideo = false;
                        alertService.success("Success", "Video Updated Successfully.");
                    }
                })
            }
        };

        $scope.questionsubmit = function (id) {
            $scope.question.video = [];
            $scope.question.video.push($scope.question.firstvideo);
            $scope.question.video.push($scope.question.secondvideo);
            if (!id) {
                var json = {
                    "type": 'question',
                    "title": $scope.question.title,
                    "content": $scope.question.content,
                    "video": $scope.question.video,
                    "user": $scope.userData._id
                }
                ApiService.putModel(ApiEndpoint.Models.HELP, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editquestion = false;
                        alertService.success("Success", "Question Added Successfully.");
                    }
                })
            } else {
                var json = {
                    "type": 'question',
                    "title": $scope.question.title,
                    "content": $scope.question.content,
                    "video": $scope.question.video,
                    "user": $scope.userData._id
                }
                ApiService.postModel(ApiEndpoint.Models.HELP + '/' + id, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editquestion = false;
                        alertService.success("Success", "Question Updated Successfully.");
                    }
                })
            }
        };

        $scope.cvsubmit = function (id) {
            $scope.cv.video = [];
            $scope.cv.video.push($scope.cv.firstvideo);
            $scope.cv.video.push($scope.cv.secondvideo);
            if (!id) {
                var json = {
                    "type": 'cv',
                    "content": $scope.cv.content,
                    "title": $scope.cv.title,
                    "video": $scope.cv.video,
                    "user": $scope.userData._id
                }
                ApiService.putModel(ApiEndpoint.Models.HELP, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editcv = false;
                        alertService.success("Success", "CV Added Successfully.");
                    }
                })
            } else {
                var json = {
                    "type": 'cv',
                    "content": $scope.cv.content,
                    "title": $scope.cv.title,
                    "video": $scope.cv.video,
                    "user": $scope.userData._id
                }
                ApiService.postModel(ApiEndpoint.Models.HELP + '/' + id, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editcv = false;
                        alertService.success("Success", "CV Updated Successfully.");
                    }
                })
            }
        };

        $scope.profilesubmit = function (id) {
            $scope.profile.video = [];
            $scope.profile.video.push($scope.profile.firstvideo);
            $scope.profile.video.push($scope.profile.secondvideo);
            if (!id) {
                var json = {
                    "type": 'profile',
                    "content": $scope.profile.content,
                    "title": $scope.profile.title,
                    "video": $scope.profile.video,
                    "user": $scope.userData._id
                }
                ApiService.putModel(ApiEndpoint.Models.HELP, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editprofile = false;
                        alertService.success("Success", "Profile Added Successfully.");
                    }
                })
            } else {
                var json = {
                    "type": 'profile',
                    "content": $scope.profile.content,
                    "title": $scope.profile.title,
                    "video": $scope.profile.video,
                    "user": $scope.userData._id
                }
                ApiService.postModel(ApiEndpoint.Models.HELP + '/' + id, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.helpinfo.push(response.data.data);
                        $scope.latest_date = response.data.data.last_updated;
                        $scope.useradded = $scope.userData.firstname;
                        $scope.editprofile = false;
                        alertService.success("Success", "Profile Updated Successfully.");
                    }
                })
            }
        };
    });


