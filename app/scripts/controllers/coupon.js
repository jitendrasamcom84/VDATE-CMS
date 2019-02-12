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
    .controller('CouponCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.couponinfo = [];
        $scope.userinfo2 = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.loading = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.minDateMoment = moment().subtract(0, 'day');
        $scope.minDateString = moment().subtract(0, 'day').format('YYYY-MM-DD');
        $scope.coupon = {};

        var loadCouponInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.COUPON, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.couponinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadUserInfo();
                }
            });
        };
        loadCouponInfo();

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

        // Add coupon
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.COUPON, $scope.coupon).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.couponinfo.push($scope.coupon);
                    $location.path("/coupon");
                    alertService.success("Success", "Coupon Added Successfully.");
                }
            })
        };

        // Edit Coupon
        $scope.editCoupon = function (url) {
            $location.path(url);
        };

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.COUPON, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.coupon = response.data;
                    var expiredate = $filter('date')($scope.coupon.expire_date, "yyyy-MM-dd");
                    $scope.couponForm.expire_date.stringDate = expiredate;
                    $scope.coupon.linked_user = _.map($scope.coupon.linked_user, function (value) {
                        return value._id;
                    });
                    if (response.data.user) {
                        $scope.coupon.user = response.data.user._id;
                    }

                }
            });
        }

        // Update Coupon
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.COUPON + "/" + $routeParams.id, $scope.coupon).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/coupon");
                    alertService.success("Success", "Coupon Updated Successfully.");
                }
            })
        };

        // Delete Order
        $scope.deleteData = function (c) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete coupon?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.COUPON, c._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Coupon Deleted Successfully");
                            // window.location.reload();
                            $route.reload();
                        }
                    });
                }
            });
        };

        // Active/Deactive Coupon
        $scope.activeCoupon = function (c, index) {
            $scope.loading = true;
            if (c.is_active == false) {
                var json = { is_active: true }
                ApiService.postModel(ApiEndpoint.Models.COUPON + "/" + c.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Coupon Active Successfully.");
                        $scope.couponinfo[index].is_active = json.is_active;
                        $scope.loading = false;
                    }
                })
            } else {
                var json = { is_active: false }
                ApiService.postModel(ApiEndpoint.Models.COUPON + "/" + c.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Coupon Deactive Successfully.");
                        $scope.couponinfo[index].is_active = json.is_active;
                        $scope.loading = false;
                    }
                })
            }
        }

        $scope.checkdate = function (coupon) {
            var todaydate = $filter('date')(new Date(), 'yyyy-MM-dd');
            var expiredate = $filter('date')(coupon.expire_date, 'yyyy-MM-dd ');

            if (expiredate < todaydate) {
                return false;
            } else {
                return true;
            }
        };

        $scope.checkActive = function (coupon) {
            var todaydate = $filter('date')(new Date(), 'yyyy-MM-dd');
            var expiredate = $filter('date')(coupon.expire_date, 'yyyy-MM-dd ');

            if (expiredate < todaydate) {
                return false;
            } else {
                return coupon.is_active;
            }
        };

    });  
