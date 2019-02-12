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
    .controller('ManagePackagesCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.packageinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        var loadPackagesInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.PACKAGES).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.packageinfo = response.data;
                }
            });
        };
        loadPackagesInfo();

        $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[^0-9\.]/g, '');
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        // Delete Packages
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete package?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.PACKAGES, w._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Package Deleted Successfully");
                            loadPackagesInfo();
                        }
                    });
                }
            });
        };

        // Edit Packages
        $scope.editPackages = function (url) {
            $location.path(url);
        };

        $scope.packages = {};

        // Add Packages
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.PACKAGES, $scope.packages).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.packageinfo.push($scope.packages);
                    $location.path("/packages");
                    alertService.success("Success", "Package Added Successfully.");
                }
            })
        };

        // Get edit data
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.PACKAGES, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.packages = response.data;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.PACKAGES + "/" + $routeParams.id, $scope.packages).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/packages");
                    alertService.success("Success", "Package Details Edit Successfully.");
                }
            })
        };
    });  
