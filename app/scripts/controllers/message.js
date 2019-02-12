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
    .controller('MessageCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.postsinfo = [];
        $scope.foruminfo = [];
        $scope.is_edit = false;
        $scope.loading = true;
        $scope.apiendpoint = ApiEndpoint;
        $scope.ShowPopup = false;
        $scope.ClosePopup = false;
        $scope.user_id = $rootScope.globals.currentUser.data.user;

        var loadPostsInfo = function () {
            var id = $routeParams.id;
            var json = {
                "where": {
                    "thread_id": id,
                    "is_deleted": false
                }
            }
            ApiService.postModel(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.POSTS, json).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.postsinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };
        loadPostsInfo();

        var loadForumInfo = function () {
            var json = {
                "where": {
                    "_id": $routeParams.id,
                    "is_deleted": false
                },
            }
            ApiService.postModel(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.THREADS, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.foruminfo = response.data.data;
                }
            });
        };
        loadForumInfo();

        //Active or deactive
        $scope.approvedData = function (f, index) {
            $scope.loading = true;
            if (f.isapproved == false) {
                var json = { isapproved: true }
                ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + f.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Deactive Successfully.");
                        $scope.foruminfo[index].isapproved = json.isapproved;
                        $scope.loading = false;
                    }
                })
            } else {
                var json = { isapproved: false }
                ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + f.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Active Successfully.");
                        $scope.foruminfo[index].isapproved = json.isapproved;
                        $scope.loading = false;
                    }
                })
            }
        }

        // Delete message
        $scope.deleteData = function (p) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete message?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.POSTS, p._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Message Deleted Successfully");
                            loadPostsInfo();
                        }
                    });
                }
            });
        };

        /* Message Popup */
        $scope.openpopup = function (data) {
            $scope.ShowPopup = !$scope.ShowPopup;
            $scope.ClosePopup = false;
            $scope.messageData = data[0];
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
                "friend_id": $scope.messageData.user_added._id,
                "type": "adminmessage",
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
