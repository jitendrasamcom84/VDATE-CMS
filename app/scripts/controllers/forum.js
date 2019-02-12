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
    .controller('ForumCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, $route, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.foruminfo = [];
        $scope.approveforum = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.loading = true;
        $scope.apiendpoint = ApiEndpoint;
        $scope.forum = {};
        $scope.user_id = $rootScope.globals.currentUser.data.user;
        var loadForumInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                },
                "with": [{
                    "model": "Posts",
                    "source": "_id",
                    "destination": "thread_id",
                    "include_deleted": false,
                    "sort": -1,
                    "json_key": "messages",
                    "count": true
                }]
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.THREADS, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.foruminfo = response.data.data;
                    for (var i = 0; i < $scope.foruminfo.length; i++) {
                        if ($scope.foruminfo[i].isapproved == true) {
                            $scope.approveforum.push($scope.foruminfo[i]);
                        }
                    }
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadUserInfo();
                }
            });
        };
        loadForumInfo();

        var loadUserInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.USER).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo1 = response.data;
                    $scope.userDatas = [];
                    for (var i = 0; i < $scope.userinfo1.length; i++) {
                        if ($scope.userinfo1[i].firstname) {
                            $scope.userDatas.push($scope.userinfo1[i]);
                            $scope.userinfo = $filter('filter')($scope.userDatas, { type: 'members' }, true);
                        }
                    }
                }
            });
        };

        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.THREADS, $scope.forum).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.foruminfo.push($scope.forum);
                    $location.path("/forum_list");
                    alertService.success("Success", "Forum Added Successfully.");
                }
            })
        };

        // Edit Forum
        $scope.editForum = function (url) {
            $location.path(url);
        };
        // Get edit data        
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.THREADS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.forum = response.data;
                    $scope.forum.user_added = response.data.user_added._id;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + $routeParams.id, $scope.forum).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/forum_list");
                    alertService.success("Success", "Forum Updated Successfully.");
                }
            })
        };

        // Delete forum
        $scope.deleteData = function (f) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete forum?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.THREADS, f._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Forum Deleted Successfully");
                            $route.reload();
                        }
                    });
                }
            });
        };

        // Go To Message
        $scope.GoToMessage = function (url) {
            $location.path(url);
        };

        //Approved or dissaproved
        $scope.approvedData = function (f, index) {
            $scope.loading = true;
            if (f.isapproved == false) {
                var json = { isapproved: true }
                ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + f.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Active Successfully.");
                        $scope.foruminfo[index].isapproved = json.isapproved;
                        $scope.messageData = response.data.data;
                        $scope.sendNotification('הפורום שלך אושר ועלה בהצלחה לאתר');
                        $scope.loading = false;
                    }
                })
            } else {
                var json = { isapproved: false }
                ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + f.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Deactive Successfully.");
                        $scope.foruminfo[index].isapproved = json.isapproved;
                        $scope.messageData = response.data.data;
                        $scope.sendNotification('הטופס שלך לא אושר');
                        $scope.loading = false;
                    }
                })
            }
        }

        $scope.sendNotification = function (message) {
            if (message == null || message == '' || message.trim() == '') {
                alertService.error('Please Enter Message');
                return false;
            }
            var json = {
                "user_id": $scope.user_id,
                "friend_id": $scope.messageData.user_added._id,
                "type": "adminforum_approved",
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

    });  
