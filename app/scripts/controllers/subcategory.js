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
    .controller('SubCatCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, $cookieStore, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.ques_catinfo = [];
        $scope.questionsinfo = [];
        $scope.subcatinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        $scope.ques_cat_id = '';

        // List Subcategory
        $scope.loadSubCatinfo = function (index) {
            var json = {
                "where": {
                    "ques_cat": $scope.ques_catinfo[index]._id,
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.SUBCATEGORY, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.subcatinfo = response.data.data;
                    $scope.ques_cat_id = $scope.ques_catinfo[index]._id;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };

        $scope.GoToSubCat = function (url) {
            $location.path(url);
        }

        $scope.subcategory = {};
        // Add Subcategory
        $scope.AddSubcategory = function () {
            // var ActiveclassSet = $cookieStore.get(index);
            // console.log('ActiveclassSet', ActiveclassSet);
            var json = {
                "ques_cat": $routeParams.id,
                "subcat_name": $scope.subcategory.subcat_name,
            }
            ApiService.putModel(ApiEndpoint.Models.SUBCATEGORY, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {

                    $scope.subcatinfo.push($scope.subcategory);
                    $rootScope.globals.question = response.data.data;
                    $rootScope.globals.index = $rootScope.globals.index;
                    $location.path("/questionnaire");
                    alertService.success("Success", "Subcategory Added Successfully.");
                }
            })
        };

        // Get edit Subcategory        
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.SUBCATEGORY, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    if (response.data != null) {
                        $scope.is_edit = true;
                        $scope.subcategory = response.data;
                    }
                }
            });
        }

        // Update Subcategory
        $scope.UpdateSubcategory = function (id) {
            ApiService.postModel(ApiEndpoint.Models.SUBCATEGORY + "/" + $routeParams.id, $scope.subcategory).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $location.path("/questionnaire");
                    alertService.success("Success", "SubCategory Details Edit Successfully.");
                }
            })
        };

        $scope.GoToQuestionnarie = function () {
            $rootScope.globals.index = $rootScope.globals.index;
            $location.path("/questionnaire");
        }


    });  
