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
    .controller('AdminCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.admininfo = [];
        $scope.is_edit = false;
        $scope.loading = true;
        $scope.apiendpoint = ApiEndpoint;
        $scope.admin = {};
        $scope.buttonShow = false;
        // admin list
        var loadAdminInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.USER, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.admininfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };
        loadAdminInfo();



        $scope.deleteData = function (admin) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete admin?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.USER, admin._id).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            console.log('response', response);
                            alertService.success("Success", "Admin Deleted Successfully");
                            window.location.reload();
                            // loadUserInfo();
                        }
                    });
                }
            });
        };

        // Add Admin
        $scope.submit = function () {
            var json = {
                "firstname": $scope.admin.firstname,
                "email": $scope.admin.email,
                "password": $scope.admin.password,
                "type": "admin"
            }
            ApiService.putModel(ApiEndpoint.Models.USER, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.admininfo.push($scope.admin);
                    $location.path("/admin_list");
                    alertService.success("Success", "Admin Added Successfully.");
                }
            })
        };

        // Edit Admin
        $scope.editAdmin = function (url) {
            $location.path(url);
        };

                // Reset Password
                $scope.resetpassword = function (url) {
                    $location.path(url);
                };

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.USER, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.admin = response.data;
                }
            });
        }

        // Update Admin
        $scope.editSubmit = function (id) {
            var json = {
                "firstname": $scope.admin.firstname,
                "email": $scope.admin.email,
                "password": $scope.admin.password,
                "type": "admin"
            }
            ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/admin_list");
                    alertService.success("Success", "Admin Updated Successfully.");
                }
            })
        };


    });