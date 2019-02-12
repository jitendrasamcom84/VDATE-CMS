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
    .controller('AboutUSCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.aboutusinfo = [];
        $scope.is_edit = false;
        $scope.loading = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        $scope.edit = false;
        // Get edit data
        $scope.aboutus = {};
        $scope.userData = $rootScope.globals.currentUser.data.user;

        var id = "5b39bd614565d16894763b39";
        ApiService.getModelById(ApiEndpoint.Models.ABOUTUS, id).then(function (response) {
            if (response.is_error) {
                // alertService.error(response.message);
            } else {
                $scope.aboutus = response.data;
                $scope.aboutus.aboutus_image = $scope.aboutus.image;
            }
        });

        $scope.aboutClear = function () {
            if ($scope.edit == true) {
                $scope.aboutus.content = '';
            }
        }

        $scope.change = function () {
            var image_display = $scope.aboutus.image;
            $scope.aboutus.image = $scope.aboutus.image.name;
            if (image_display) {
                upload(image_display, $scope.aboutus);
            }
        }

        $scope.editable = function () {
            if ($scope.edit != true) {
                $scope.edit = true;
            } else {
                $scope.edit = false;
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
            var json = {
                "content": $scope.aboutus.content,
                "user": $scope.userData._id
            }
            ApiService.postModel(ApiEndpoint.Models.ABOUTUS + "/5b39bd614565d16894763b39", json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    alertService.success("Success", "AboutUS Updated Successfully.");
                    // window.location.reload();
                    $route.reload();
                }
            })

        };
    });  
