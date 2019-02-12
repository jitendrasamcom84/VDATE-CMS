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
    .controller('OrderCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.orderinfo = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.is_edits = false;
        $scope.loading = true;
        $scope.apiendpoint = ApiEndpoint;
        $scope.order = {};
        $scope.userinfo2 = [];

        var loadOrderInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.ORDER, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.orderinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    if ($scope.orderinfo.length < 3) {
                        $scope.is_edits = false;
                    } else {
                        $scope.is_edits = true;
                    }
                    $scope.loading = false;
                    loadUserInfo();
                    loadPackageInfo();
                }
            });
        };
        loadOrderInfo();

        var loadUserInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.USER).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo1 = response.data;
                    for (var i = 0; i < $scope.userinfo1.length; i++) {
                        if ($scope.userinfo1[i].firstname != '') {
                            $scope.userinfo2.push($scope.userinfo1[i]);
                        }
                    }
                    $scope.userinfo = $filter('filter')($scope.userinfo2, { type: 'members' }, true);
                }
            });
        };

        var loadPackageInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.PACKAGES).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.packageinfo = response.data;
                }
            });
        };

        $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[^0-9\.]/g, '');
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $(".discount").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[1-9][0-9][0-9]/g, '100');
            $(this).val($(this).val().replace(/[1-9][0-9][0-9]/g, '100'));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $scope.myFunc = function () {
            ApiService.getModel(ApiEndpoint.Models.PACKAGES + '/' + $scope.order.package).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.package_price = response.data;
                    $scope.order.price = $scope.package_price.price
                }
            });
        }

        // Add Order
        $scope.submit = function () {
            // $scope.discount_price = $scope.order.price * $scope.order.discount / 100
            // $scope.new_price = $scope.order.price - $scope.discount_price;
            ApiService.putModel(ApiEndpoint.Models.ORDER, $scope.order).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.orderinfo.push($scope.packages);
                    $location.path("/order");
                    alertService.success("Success", "Order Added Successfully.");
                }
            })
        };

        // Edit Order
        $scope.editOrder = function (url) {
            $location.path(url);
        };

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.ORDER, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.order = response.data;
                    $scope.order.user = response.data.user._id;
                    $scope.order.package = response.data.package._id;
                }
            });
        }

        // Update Order
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.ORDER + "/" + $routeParams.id, $scope.order).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/order");
                    alertService.success("Success", "Order Updated Successfully.");
                }
            })
        };

        // Delete Order
        $scope.deleteData = function (o) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete order?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.ORDER, o._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Order Deleted Successfully");
                            $route.reload();
                        }
                    });
                }
            });
        };


    });


