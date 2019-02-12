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
    .controller('QuesansCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.QAinfo = [];
        $scope.loading = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.edit = false;
        $scope.QA = {};
        $scope.is_edit = false;
        $scope.userData = $rootScope.globals.currentUser.data.user;

        var loadQAinfo = function () {
            var json = {
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.FAQ, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.QAinfo = response.data.data;
                    $scope.QA = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };
        loadQAinfo();

        $scope.submit = function () {
            var json = {
                "question": $scope.questions,
                "answer": $scope.answer,
                "user": $scope.userData._id
            }
            ApiService.putModel(ApiEndpoint.Models.FAQ, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.QAinfo.push($scope.QA);
                    alertService.success("Success", "Q&A Added Successfully.");
                    $location.path("/que_ans_list");
                }
            })
        };

        $scope.editable = function () {
            if ($scope.edit == false) {
                $scope.edit = true;
            } else {
                $scope.edit = false;
            }
        }

        // Edit QA
        $scope.editQA = function (url) {
            $location.path(url);
        };

        // Get edit data
        if ($routeParams.id != '') {

            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.FAQ, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    // $scope.QA = response.data;
                    $scope.last_updated = response.data.last_updated;
                    $scope.user = response.data.user.firstname;
                    $scope.questions = response.data.question;
                    $scope.answer = response.data.answer;
                }
            });
        }

        // Update QA
        $scope.editSubmit = function (id) {
            var json = {
                "question": $scope.questions,
                "answer": $scope.answer,
                "user": $scope.userData._id
            }
            ApiService.postModel(ApiEndpoint.Models.FAQ + "/" + $routeParams.id, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/que_ans_list");
                    alertService.success("Success", "Q&A Updated Successfully.");
                }
            })
        };

        // Delete QA
        $scope.deleteData = function (q) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete Q&A?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.FAQ, q._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Q&A Deleted Successfully");
                            $route.reload();
                        }
                    });
                }
            });
        };

    });  
