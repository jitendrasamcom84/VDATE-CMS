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
    .controller('ManageQuestionsCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.questionsinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        var loadQuestionsinfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.QUESTIONS, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.questionsinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadQues_CatInfo();
                }
            });
        };
        loadQuestionsinfo();
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

        // Delete Question 
        $scope.deleteData = function (w) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete question?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    ApiService.softDeleteModel(ApiEndpoint.Models.QUESTIONS, w._id).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            alertService.success("Success", "Question Deleted Successfully");
                            window.location.reload();
                            // loadQuestionsinfo();
                        }
                    });
                }
            });
        };

        // Edit Question
        $scope.editQuestions = function (url) {
            $location.path(url);
        };

        $scope.questions = {};

        $scope.submit = function () {
            ApiService.putModel(ApiEndpoint.Models.QUESTIONS, $scope.questions).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.questionsinfo.push($scope.questions);
                    $location.path("/questionnaire");
                    alertService.success("Success", "Question Added Successfully.");
                }
            })
        };

        // Get edit data        
        if ($routeParams.id != '') {
            
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.QUESTIONS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    $scope.is_edit = true;
                    $scope.questions = response.data;
                    $scope.questions.ques_cat = $scope.questions.ques_cat._id;
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.QUESTIONS + "/" + $routeParams.id, $scope.questions).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $location.path("/questionnaire");
                    alertService.success("Success", "Question Details Edit Successfully.");
                }
            })
        };
    });  
