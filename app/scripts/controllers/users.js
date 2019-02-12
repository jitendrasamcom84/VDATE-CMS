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

    .controller('UserCtrl', function ($scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        var loadUserInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.USER).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo = _.filter(response.data, function (o) {
                        return o._id !== $rootScope.globals.currentUser.data.user._id;
                    });
                    $scope.loading = false;
                }
            });
        };
        loadUserInfo();

        $scope.deActiveUser = function (user) {
            var json = { "_id": user._id, "is_locked": !user.is_locked };

            ApiService.postModel(ApiEndpoint.Models.USER, json).then(function (response) {
                if (response.is_error) {
                } else {
                    var msg = "User deactivated successfully";
                    if (user.is_locked) {
                        msg = "User activated successfully";
                    }
                    alertService.success("Success", msg);
                    loadUserInfo();
                }
            });
        };
        // Delete User
        $scope.deleteUser = function (user) {
            ApiService.softDeleteModel(ApiEndpoint.Models.USER, user._id).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    alertService.success("Success", "User Deleted");
                    loadUserInfo();
                }
            });
        }
    })

    .controller('ManageUserCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.user = {};

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.popup1 = {
            opened: false
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.dateOptions = {
            maxDate: new Date(),
            startingDay: 1
        };

        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.USER, $scope.user).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    if ($scope.new_user_avatar) {
                        upload($scope.new_user_avatar, response.data);
                    } else {
                        $location.path("/users");
                    }
                    alertService.success("Success", "User Added Successfully");
                }
            })
        };

        var upload = function (file, user) {
            if (file == null) {
                $.bigBox({
                    title: "Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Please select valid file. <br/> Max 5MB, no more then 1000px of width and height. And only PNG file.</i>",
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: "1",
                    timeout: 10000
                });
                return;
            }

            var data = {
                file: file,
                field: 'avatar'
            }

            Upload.upload({
                url: ApiEndpoint.BaseUrl + 'image/upload/' + ApiEndpoint.Models.USER + '/' + user._id,
                data: data,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                console.log(resp);
                if (resp.data.is_error === false) {
                    var obj = resp.data.data;
                }
                $location.path("/users");
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };
    });