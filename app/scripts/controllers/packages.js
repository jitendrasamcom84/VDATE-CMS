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
    .controller('ManagePackagesCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.packageinfo = [];
        $scope.is_edit = false;
        $scope.hideButton = false;
        $scope.buttonShow = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        var loadPackagesInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.PACKAGES, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.packageinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    if ($scope.packageinfo.length < 3) {
                        $scope.hideButton = false;
                    } else {
                        $scope.hideButton = true;
                    }
                    $scope.loading = false;
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
                            window.location.reload();
                            // loadPackagesInfo();
                        }
                    });
                }
            });
        };

        // Edit Packages
        $scope.editPackages = function (url) {
            $location.path(url);
        };

        // Upload Photo
        var upload = function (file, user) {
            var data = {
                file: file
            }
            switch (file.type) {
                case 'image/jpeg':
                case 'image/png':
                    break;
                default:
                    alertService.error('Only jpeg or png image formats are allowed');
                    return false;
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
                    if ($scope.is_edit == false) {
                        $scope.packages.photo = upload_path + obj.file_name;

                        $scope.packages.profile_image = upload_path + obj.file_name;
                        // ApiService.putModel(ApiEndpoint.Models.PACKAGES, $scope.packages).then(function (response) {
                        //     console.log('response', response);
                        //     if (response.data.is_error) {
                        //         alertService.error(response.data.message);
                        //     } else {
                        //         $scope.packageinfo.push($scope.packages);
                        //         $location.path("/packages");
                        //         alertService.success("Success", "Package Added Successfully.");
                        //     }
                        // })
                    } else {
                        $scope.packages.photo = upload_path + obj.file_name;
                        $scope.packages.profile_image = upload_path + obj.file_name;
                        // ApiService.postModel(ApiEndpoint.Models.PACKAGES + "/" + $routeParams.id, $scope.packages).then(function (response) {
                        //     if (response.data.is_error) {
                        //         alertService.error(response.data.message);
                        //     } else {
                        //         $location.path("/packages");
                        //         alertService.success("Success", "Package Details Edit Successfully.");
                        //     }
                        // })
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        $scope.packages = {};

        // Add Packages
        $scope.submit = function () {
            if (typeof $scope.packages.photo === 'object') {
                upload($scope.packages.photo, $scope.packages);
            }
            else if ($scope.packages.photo.indexOf("http") != 0)
                upload($scope.packages.photo, $scope.packages);
            else {
                ApiService.putModel(ApiEndpoint.Models.PACKAGES, $scope.packages).then(function (response) {
                    console.log('response', response);
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.packageinfo.push($scope.packages);
                        $location.path("/packages");
                        alertService.success("Success", "Package Added Successfully.");
                    }
                })
            }
        };

        $scope.change = function () {
            var image_display = $scope.packages.photo;
            $scope.packages.photo = $scope.packages.profile_image;
            if (image_display) {
                upload(image_display, $scope.packages);
            }
        }

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.PACKAGES, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;        
                    $scope.packages = response.data;
                    $scope.packages.profile_image = $scope.packages.photo;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            if ($scope.packages.photo.name) {
                upload($scope.packages.photo, $scope.packages);
            } else {
                ApiService.postModel(ApiEndpoint.Models.PACKAGES + "/" + $routeParams.id, $scope.packages).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $location.path("/packages");
                        alertService.success("Success", "Package Details Edit Successfully.");
                    }
                })
            }
        };
    });  
