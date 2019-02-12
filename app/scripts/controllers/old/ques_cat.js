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
    .controller('ManageQuestCatCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.ques_catinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        var loadQues_CatInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.QUES_CAT).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.ques_catinfo = response.data;
                }
            });
        };
        loadQues_CatInfo();

        // Delete Question categorie
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete question category?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.QUES_CAT, w._id).then(function (response) {
                        if (response.data.is_error) {
                            alertService.error(response.data.message);
                        } else {
                            alertService.success("Success", "Question Category Deleted Successfully");
                            loadQues_CatInfo();
                        }
                    });
                }
            });
        };

        // Edit Question categorie
        $scope.editQues_Cat = function (url) {
            $location.path(url);
        };

        $scope.ques_cat = {};

        // Add Question categorie
        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.QUES_CAT, $scope.ques_cat).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.ques_catinfo.push($scope.ques_cat);
                    $location.path("/ques_cat");
                    alertService.success("Success", "Question Category Added Successfully.");
                }
            })
        };

        // Get edit data
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.QUES_CAT, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.ques_cat = response.data;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.QUES_CAT + "/" + $routeParams.id, $scope.ques_cat).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/ques_cat");
                    alertService.success("Success", "Question Category Details Edit Successfully.");
                }
            })
        };
    });  
