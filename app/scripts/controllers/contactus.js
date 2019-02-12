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
    .controller('ManageContactUSCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, $route, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.contactusinfo = [];
        $scope.headlineinfo = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        var loadContactUSInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.CONTACTUS, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.contactusinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };
        loadContactUSInfo();

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

    });  
