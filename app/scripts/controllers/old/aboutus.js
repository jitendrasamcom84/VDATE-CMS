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
    .controller('AboutUSCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.aboutusinfo = [];
        $scope.is_edit = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;

        // Get edit data
        $scope.aboutus = {};

        var id = "5b39bd614565d16894763b39";
        ApiService.getModelById(ApiEndpoint.Models.ABOUTUS, id).then(function (response) {
            if (response.is_error) {
                // alertService.error(response.message);
            } else {
                $scope.aboutus = response.data;
                $scope.aboutus.aboutus_image = $scope.aboutus.image;
            }
        });

        $scope.change = function () {
            if ($scope.aboutus.image.name) {
                upload($scope.aboutus.image, $scope.aboutus);
            }
        }

        // Image Upload
        var upload = function (file, aboutus) {
            var data = {
                file: file
            }
            Upload.upload({
                url: ApiEndpoint.BaseUrl + 'image/upload',
                data: data,
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json'
                }
            }).then(function (resp) {

                if (resp.data.is_error === false) {
                    var obj = resp.data.data;
                    $scope.aboutus.image = upload_path + obj.file_name;
                    $scope.aboutus.aboutus_image = upload_path + obj.file_name;
                    // ApiService.postModel(ApiEndpoint.Models.ABOUTUS + "/5b39bd614565d16894763b39", $scope.aboutus).then(function (response) {
                    //     if (response.data.is_error) {
                    //         alertService.error(response.data.message);
                    //     } else {

                    //         $scope.aboutus.aboutus_image = response.data.data.image;
                    //         $scope.aboutus.image = response.data.data.image;
                    //         alertService.success("Success", "AboutUS Updated Successfully.");

                    //     }
                    // })

                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        // Update data
        $scope.editSubmit = function () {
            ApiService.postModel(ApiEndpoint.Models.ABOUTUS + "/5b39bd614565d16894763b39", $scope.aboutus).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    alertService.success("Success", "AboutUS Updated Successfully.");

                }
            })

        };
    });  
