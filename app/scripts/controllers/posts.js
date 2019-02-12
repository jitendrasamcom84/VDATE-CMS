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
    .controller('ManagePostsCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.postsinfo = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.apiendpoint = ApiEndpoint;
        var loadPostsInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.POSTS).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.postsinfo = response.data;
                    loadUserInfo();
                    loadThreadsInfo();
                }
            });
        };
        loadPostsInfo();
        var loadUserInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.USER).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo1 = response.data;
                    $scope.userinfo = $filter('filter')($scope.userinfo1, { type: 'members' }, true);

                }
            });
        };
        var loadThreadsInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.THREADS).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.threadsinfo = response.data;
                }
            });
        };

        // Delete Posts
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete post?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.POSTS, w._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Posts Deleted Successfully");
                            loadPostsInfo();
                        }
                    });
                }
            });
        };

        // Edit Posts
        $scope.editPosts = function (url) {
            $location.path(url);
        };

        $scope.posts = {};

        // Add Post
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.POSTS, $scope.posts).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.postsinfo.push($scope.posts);
                    $location.path("/posts");
                    alertService.success("Success", "Posts Added Successfully.");
                }
            })
        };
        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.POSTS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;        
                    $scope.posts = response.data;
                    $scope.posts.user_added = $scope.posts.user_added._id;
                    $scope.posts.thread_id = $scope.posts.thread_id._id;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.POSTS + "/" + $routeParams.id, $scope.posts).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/posts");
                    alertService.success("Success", "Posts Details Edit Successfully.");
                }
            })
        };
    });  
