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
    .controller('ManageResponsesCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.responsesinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        var loadResponsesInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.RESPONSES).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.responsesinfo = response.data;
                }
            });
        };
        loadResponsesInfo();

        var loadQuestionsinfo = function () {
            ApiService.getModel(ApiEndpoint.Models.QUESTIONS).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.questionsinfo = response.data;
                }
            });
        };
        loadQuestionsinfo();

        // Delete Responses
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete response?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.RESPONSES, w._id).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            alertService.success("Success", "Response Deleted Successfully");
                            loadResponsesInfo();
                        }
                    });
                }
            });
        };

        // Edit Responses
        $scope.editResponses = function (url) {
            $location.path(url);
        };

        $scope.responses = {};

        // Add Responses
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.RESPONSES, $scope.responses).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.responsesinfo.push($scope.responses);
                    $location.path("/responses");
                    alertService.success("Success", "Response Added Successfully.");
                }
            })
        };

        // Get edit data        
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.RESPONSES, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.responses = response.data;
                    $scope.responses.question_id = $scope.responses.question_id._id;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.RESPONSES + "/" + $routeParams.id, $scope.responses).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $location.path("/responses");
                    alertService.success("Success", "Response Details Edit Successfully.");
                }
            })
        };
    });  
