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
    .controller('ManageThreadsCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.threadsinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;

        var loadThreadsInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.THREADS, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.threadsinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadUserInfo();
                }
            });
        };
        loadThreadsInfo();

        var loadUserInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.USER).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo1 = response.data;
                    $scope.userinfo = $filter('filter')($scope.userinfo1, { type: 'members' }, true);
                }
            });
        };

        // Delete threads
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete threads?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.THREADS, w._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            console.log('responses', response);
                            alertService.success("Success", "Threads Deleted Successfully");
                            window.location.reload();
                            // loadThreadsInfo();
                        }
                    });
                }
            });
        };

        //Approved or dissaproved
        $scope.approvedData = function (w, index) {
            $scope.loading = true;
            if (w.isapproved == false) {
                var json = { isapproved: true }
                ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + w.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Approved Successfully.");
                        $scope.threadsinfo[index].isapproved = json.isapproved;
                        notification(w);
                        $scope.loading = false;
                    }
                })
            } else {
                var json = { isapproved: false }
                ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + w.id, json).then(function (response) {
                    if (response.is_error) {
                        alertService.error(response.message);
                    } else {
                        alertService.success("Success", "Decline Successfully.");
                        $scope.threadsinfo[index].isapproved = json.isapproved;
                        // notification(w);
                        $scope.loading = false;
                    }
                })
            }
        }

        var notification = function (w) {
            var json = {
                "user_id": w.user_added._id,
                "friend_id": w.user_added._id,
                "is_approved": true,
                "type": "forum_approved",
                "message": "בקשת הפורום אושרה בהצלחה"
            }
            ApiService.putModel(ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    // alertService.success("Success", "Decline Successfully.");
                }
            })
        }

        // Edit threads
        $scope.editThreads = function (url) {
            $location.path(url);
        };

        $scope.threads = {};

        // Add threads
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.THREADS, $scope.threads).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.threadsinfo.push($scope.threads);
                    $location.path("/threads");
                    alertService.success("Success", "Threads Added Successfully.");
                }
            })
        };

        // Get edit data        
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.THREADS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.threads = response.data;
                    $scope.threads.user_added = $scope.threads.user_added._id;
                    $scope.threads.isapproved = ($scope.threads.isapproved == true) ? "1" : "0";
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.THREADS + "/" + $routeParams.id, $scope.threads).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/threads");
                    alertService.success("Success", "Threads Details Edit Successfully.");
                }
            })
        };
    });  
