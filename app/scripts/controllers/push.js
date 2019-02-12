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
    .controller('PushCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.pushinfo = [];
        $scope.packageinfo = [];
        $scope.filterinfo = [];
        $scope.is_edit = false;
        $scope.loading = true;
        $scope.apiendpoint = ApiEndpoint;
        $scope.minDateMoment = moment().subtract(0, 'day');
        $scope.minDateString = moment().subtract(0, 'day').format('YYYY-MM-DD');
        $scope.user_id = $rootScope.globals.currentUser.data.user;
        $scope.num_of_fillterUser = 0;
        $scope.userDetails = [];
        var loadPushInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "type": "filterpushnoti",
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.pushinfo = response.data.data;
                    // console.log('$scope.pushinfo', $scope.pushinfo);
                    $scope.loading = false;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    loadPackagesInfo();
                }
            });
        };
        loadPushInfo();

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

        $(".percentage").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[1-9][0-9][0-9]/g, '100');
            $(this).val($(this).val().replace(/[1-9][0-9][0-9]/g, '100'));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $scope.pushs = {};


        // Filter Push Notification
        $scope.filterData = function () {
            var todate = angular.copy($scope.pushs.to_date);
            var checkfrom = moment($scope.pushs.from_date, 'YYYY/MM/DD');
            var checkto = moment(todate, 'YYYY/MM/DD');
            
            var monthfrom = checkfrom.format('M');
            var dayfrom = checkfrom.format('D');
            var yearfrom = checkfrom.format('YYYY');

            var monthto = checkto.format('M');
            var dayto = checkto.format('D');
            var yearto = checkto.format('YYYY');

            $scope.pushs.from_date = yearfrom + '-' + monthfrom + '-' + dayfrom;
            todate = yearto + '-' + monthto + '-' + dayto;
            $scope.pushForm.from_date.stringDate = $scope.pushs.from_date;
            $scope.pushForm.to_date.stringDate = todate;
            
            if (!$scope.pushs.from_num_frd || !$scope.pushs.to_num_frd || !$scope.pushs.package || !$scope.pushs.percentage) {
                var packages = []
                var from_num_frd = $scope.pushs.from_num_frd;
                var to_num_frd = $scope.pushs.to_num_frd;
                packages = $scope.pushs.package;
                packages = '';
                var percentage = $scope.pushs.percentage;
            }
            console.log('second', $scope.pushs.to_date);
            var json = {
                "from_date": $scope.pushs.from_date,
                "to_date": $scope.pushs.to_date,
                "from_num_frd": from_num_frd,
                "to_num_frd": to_num_frd,
                "package": packages,
                "percentage": percentage,
            }
            ApiService.postModelWQ(ApiEndpoint.Models.FILTER, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.filterinfo = response.data.data;
                    
                    $scope.num_of_fillterUser = response.data.data.length;
                    for (var i = 0; i < $scope.filterinfo.length; i++) {
                        $scope.userDetails.push($scope.filterinfo[i]._id);
                    }
                    if ($scope.filterinfo.length != 0) {
                        $scope.submit();
                    } else {
                        alertService.error("No user found");
                    }

                }
            })
        };



        // Add Push Notification
        $scope.submit = function () {
            var json = {
                "subject": "filterpushnoti",
                "user_ids": $scope.userDetails,
                "user_id": $scope.user_id._id,
                "message": $scope.pushs.message,
                "package": $scope.pushs.package,
                "from_date": $scope.pushs.from_date,
                "to_date": $scope.pushs.to_date,
                "percentage": $scope.pushs.percentage,
                "from_num_frd": $scope.pushs.from_num_frd,
                "to_num_frd": $scope.pushs.to_num_frd,
                "num_of_user": $scope.num_of_fillterUser
            }
            ApiService.postModelWQ(ApiEndpoint.Models.NOTIFICATIONS, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.pushinfo.push($scope.pushs);
                    $location.path("/push");
                    alertService.success("Success", "Push Notification Added Successfully.");
                }
            })
        };

        // Delete Posts
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete post?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.POSTS, w._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Posts Deleted Successfully");
                            loadPostsInfo();
                        }
                    });
                }
            });
        };

        // Edit Posts
        $scope.editPosts = function (url) {
            $location.path(url);
        };




        // Get edit data
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.POSTS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.posts = response.data;
                    $scope.posts.user_added = $scope.posts.user_added._id;
                    $scope.posts.thread_id = $scope.posts.thread_id._id;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.POSTS + "/" + $routeParams.id, $scope.posts).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/posts");
                    alertService.success("Success", "Posts Details Edit Successfully.");
                }
            })
        };
    });

