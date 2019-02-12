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
    .controller('ManageHeadlineCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, $route, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.headlineinfo = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        $scope.loadHeadlineInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.HEADLINE, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.headlineinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };
        $scope.loadHeadlineInfo();

        // Delete ContactUS
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete contact details?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.CONTACTUS, w._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Contact Details Deleted Successfully");
                            $route.reload();
                        }
                    });
                }
            });
        };

        // Add Headline
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.HEADLINE, $scope.contact).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.headlineinfo.push($scope.contact);
                    $location.path("/contactus_headline");
                    alertService.success("Success", "Headline Added Successfully.");
                }
            })
        };

        // Edit Headline
        $scope.editHeadline = function (url) {
            $location.path(url);
        };

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.HEADLINE, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.contact = response.data;
                }
            });
        }

        // Update headline
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.HEADLINE + "/" + $routeParams.id, $scope.contact).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.headlineinfo.push($scope.contact);
                    $location.path("/contactus_headline");
                    alertService.success("Success", "Headline Updated Successfully.");
                }
            })
        };

        // Delete Headline
        $scope.deleteHeadline = function (h) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure, you want to delete headline?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.HEADLINE, h._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Headline Deleted Successfully");
                            $route.reload();
                        }
                    });
                }
            });
        };
    });  
