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
    .controller('ResetPasswordCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.admininfo = [];
        $scope.is_edit = false;
        $scope.loading = true;
        $scope.apiendpoint = ApiEndpoint;
        $scope.resetpass = {};
        
        // Update Admin
        $scope.submit = function (id) {
            if($scope.resetpass.new_password != $scope.resetpass.confirm_password){
                alertService.error("New Password and Confirm Password does not match");
                return;
            }
            var json ={
                "password" : $scope.resetpass.new_password
            }
            ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/admin_list");
                    alertService.success("Success", "Admin Password Updated Successfully.");
                }
            })
        };


    });