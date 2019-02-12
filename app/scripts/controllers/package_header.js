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
    .controller('PackageHeaderCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.contentinfo = [];
        $scope.is_edit = false;
        $scope.loading = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        $scope.edit = false;
        // Get edit data
        $scope.content = {};
        $scope.userData = $rootScope.globals.currentUser.data.user;

        var json = {
            "sort": { "create_date": "-1" },
            "where": {
                "is_deleted": false
            }
        }
        ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.PACKAGE_HEADER, json).then(function (response) {
            if (response.is_error) {
                // alertService.error(response.message);
            } else {
                if (response.data.data != '') {
                    $scope.content = response.data.data[0];
                    $scope.content_id = $scope.content._id;
                }
            }
        });

        $scope.contentClear = function () {
            if ($scope.content.title) {
                $scope.content.title = '';
            }
        }

        // Update data
        $scope.editSubmit = function () {
            var json = {
                "title": $scope.content.title,
            }
            if ($scope.content_id) {
                ApiService.postModel(ApiEndpoint.Models.PACKAGE_HEADER + "/" + $scope.content_id, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        alertService.success("Success", "Package header Updated Successfully.");
                        $route.reload();
                    }
                })
            } else {
                ApiService.putModel(ApiEndpoint.Models.PACKAGE_HEADER, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        alertService.success("Success", "Package header Added Successfully.");
                        $route.reload();
                    }
                })
            }
        };
    });  
