'use strict';

/**
 * @ngdoc function
 * @name vdateApp.controller:MainCtrl
 * @description
 * # UserCtrl
 * Controller of the vdateApp
 */
angular.module('vdateApp')
    .controller('ProfileCtrl', function ($scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, blockUI) {
        $scope.login_user = [];
        if ($rootScope.globals && $rootScope.globals.currentUser) {
            $scope.login_user = $rootScope.globals.currentUser.data.user;
        }
    })
    .controller('ManageEventsCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, blockUI, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.eventsinfo = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.minDateMoment = moment().subtract(0, 'day');
        $scope.minDateString = moment().subtract(0, 'day').format('YYYY-MM-DD HH:mm');
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        var loadEventsInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.EVENTS, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.eventsinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadUserInfo();
                }
            });
        };
        loadEventsInfo();

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

        $scope.checkdate = function (date, time) {
            var todaydate = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm');
            var eventdate = $filter('date')(date, 'yyyy-MM-dd ' + time);
            if (eventdate < todaydate) {
                return true;
            }
            else {
                return false;
            }
        };
        /* Delete Event */
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete event?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.EVENTS, w._id).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                            console.log(response);
                        } else {
                            alertService.success("Success", "Event Deleted Successfully");
                            // window.location.reload();
                            // loadEventsInfo();
                            $route.reload();
                        }
                    });
                }
            });
        };

        // Edit Events
        $scope.editEvents = function (url) {
            $location.path(url);
        };
        $scope.events = {};
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        $scope.popup1 = {
            opened: false
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.dateOptions = {
            minDate: new Date(),
            startingDay: 1
        };
        $scope.events = {};

        // Add Events
        $scope.submit = function () {
            $scope.events.eventdate = $filter('date')($scope.events.eventdatetime._d, 'yyyy-MM-dd');
            $scope.events.eventtime = $filter('date')($scope.events.eventdatetime._d, 'HH:mm');

            ApiService.putModel(ApiEndpoint.Models.EVENTS, $scope.events).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.eventsinfo.push($scope.events);
                    $location.path("/events");
                    alertService.success("Success", "Event Added Successfully.");
                }
            })
        };

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.EVENTS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.events = response.data;
                    $scope.events.user_id = $scope.events.user_id._id;
                    $scope.events.withuser = $scope.events.withuser._id;
                    // $scope.events.withuser = $scope.events;

                    var eventdate = $filter('date')($scope.events.eventdate, "yyyy-MM-dd");
                    var eventtime = $scope.events.eventtime;

                    $scope.eventsForm.eventdatetime.stringDate = eventdate + " " + eventtime;
                    $scope.events.ishappened = ($scope.events.ishappened == true) ? "1" : "0";
                    // $scope.events.withuser = _.map($scope.events.withuser, function (value) {
                    //     return value._id;
                    // });
                    // setTimeout(function () {
                    //     loadUserInfo();
                    // }, 1000);
                }
            });
            // blockUI.stop();
        }
        else {
            loadUserInfo();
        }

        // Edit data
        $scope.editSubmit = function (id) {
            $scope.events.eventdate = $filter('date')($scope.events.eventdatetime._d, 'yyyy-MM-dd');
            $scope.events.eventtime = $filter('date')($scope.events.eventdatetime._d, 'HH:mm');

            ApiService.postModel(ApiEndpoint.Models.EVENTS + "/" + $routeParams.id, $scope.events).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/events");
                    alertService.success("Success", "Event Details Edit Successfully.");
                }
            })
        };
    });  
