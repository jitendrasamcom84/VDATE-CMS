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
    .controller('Terms&ConditionCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.termsconditioninfo = [];
        $scope.is_edit = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        $scope.BlankSpace = false;
        $scope.edit = false;
        $scope.userData = $rootScope.globals.currentUser.data.user;
        // Get edit data
        $scope.termscondition = {};
        var json = {
            "sort": { "create_date": "-1" },
            "where": {
                "is_deleted": false
            }
        }
        ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.TERMSCONDITION, json).then(function (response) {
            if (response.is_error) {
                // alertService.error(response.message);
            } else {
                if (response.data.data != '') {
                    $scope.termscondition = response.data.data[0];
                    $scope.terms_id = $scope.termscondition._id;
                }

            }
        });

        $scope.termsClear = function () {
            if ($scope.edit == true) {
                $scope.termscondition.content = '';
            }
        }


        $scope.editable = function () {
            if ($scope.edit != true) {
                $scope.edit = true;
            } else {
                $scope.edit = false;
            }
        }

        $scope.removeSpace = function () {
            if ($scope.termscondition.content) {
                $scope.termscondition.content.trim();
                $scope.BlankSpace = true;
            }
            else {
                $scope.BlankSpace = false;
            }
        }

        // Update data
        $scope.editSubmit = function () {
            if ($scope.BlankSpace) {
                var json = {
                    "content": $scope.termscondition.content,
                    "user": $scope.userData._id
                }
                if($scope.terms_id){
                    ApiService.postModel(ApiEndpoint.Models.TERMSCONDITION + '/' + $scope.terms_id, json).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Terms & Condition Updated Successfully.");
                            // window.location.reload();
                            $route.reload();
                        }
                    })
                }else{
                    ApiService.putModel(ApiEndpoint.Models.TERMSCONDITION, json).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Terms & Condition Added Successfully.");
                            // window.location.reload();
                            $route.reload();
                        }
                    })
                }
                
            } else {
                alertService.error('Do not enter space');
            }

        };
    });  
