'use strict';

/**
 * @ngdoc function
 * @name vdateApp.controller:MainCtrl
 * @description
 * # ProfileCtrl
 * Controller of the vdateApp
 */
angular.module('vdateApp')
    .controller('ProfileCtrl', function ($scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.login_user = [];
        if ($rootScope.globals && $rootScope.globals.currentUser) {
            $scope.login_user = $rootScope.globals.currentUser.data.user;
        }
    })
    .controller('ManageCheckOutsCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.checkoutsinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        var loadCheckoutsInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.CHECKOUTS).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.checkoutsinfo = response.data;
                    loadUserInfo();
                }
            });
        };
        loadCheckoutsInfo();
        var loadUserInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.USER).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo = response.data;
                }
            });
        };
        // Delete Checkouts
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete checkout?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {

                    ApiService.softDeleteModel(ApiEndpoint.Models.CHECKOUTS, w._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Checkouts Deleted Successfully");
                            loadCheckoutsInfo();
                        }
                    });
                }
            });
        };
    });  
