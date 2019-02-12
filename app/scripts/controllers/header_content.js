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
    .controller('ContentCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
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
        ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.CONTENT, json).then(function (response) {
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
                $scope.content.title = '';
        }

        $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
            
            if ((event.which != 46) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
        // Update data
        $scope.editSubmit = function (getval) {
            if (getval == 1) {
                var json = {
                    "email": $scope.content.email,
                    "phone": $scope.content.phone,
                }
            }else if (getval == 2) {
                var json = {
                    "title": $scope.content.title,
                }
            }

            if ($scope.content_id) {
                ApiService.postModel(ApiEndpoint.Models.CONTENT + "/" + $scope.content_id, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        alertService.success("Success", "Content Updated Successfully.");
                        $route.reload();
                    }
                })
            } else {
                ApiService.putModel(ApiEndpoint.Models.CONTENT, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        alertService.success("Success", "Content Added Successfully.");
                        $route.reload();
                    }
                })
            }
        };
    });  
