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
    .controller('ManageResponsesCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.jsonData = [];
        $scope.responsesinfo = [];
        $scope.questionsinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        $scope.is_disabled = false;
        $scope.question_param_id = $routeParams.id;
        var loadResponsesInfo = function () {
            var json = {
                // "sort": { "create_date": "-1" },
                "where": {
                    "question_id": $routeParams.id,
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.RESPONSES, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.responsesinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadQuestionInfo();
                }
            });
        };
        loadResponsesInfo();

        var loadQuestionInfo = function () {
            var json = {
                "where": {
                    "_id": $routeParams.id,
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.QUESTIONS, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.questionsinfo = response.data.data;
                    $scope.question = $scope.questionsinfo[0].question;
                    $scope.subcat_id = $scope.questionsinfo[0].subcat_name._id;
                    $scope.optionvalue = $scope.questionsinfo[0].optionvalue;
                    $scope.Multitextbox = [];
                    $scope.newoption = $scope.optionvalue - $scope.responsesinfo.length;
                    for (var i = 0; i < $scope.newoption; i++) {
                        $scope.Multitextbox.push(i + 1);
                    }
                    if ($scope.optionvalue == $scope.responsesinfo.length) {
                        $scope.is_disabled = true;
                    }
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };

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


        $scope.responses = {};

        // Add Responses
        $scope.submit = function () {
            $scope.newjson = [];
            for (var i = 0; i < $scope.jsonData.length; i++) {
                if ($scope.jsonData[i].answer) {
                    $scope.newjson.push($scope.jsonData[i]);
                }
            }
            var json = {
                data: $scope.newjson
            }
            ApiService.putModel(ApiEndpoint.URLS.BULK + ApiEndpoint.Models.RESPONSES, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    if (response.data) {
                        $scope.responsesinfo.push($scope.responses);
                        $location.path("/responses" + '/' + $scope.question_param_id);
                        alertService.success("Success", "Answer Added Successfully.");
                    }
                }
            })
        };

        // Edit Responses
        $scope.editResponses = function (url) {
            $location.path(url);
        };


        // Get edit data        
        if ($routeParams.id != '') {
            
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.RESPONSES, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    if (response.data != null) {
                        $scope.is_edit = true;            
                        $scope.responses = response.data;
                        $scope.responses.question_id = $scope.responses.question_id._id;
                    }
                }
            });
        }

        // Edit data
        $scope.editSubmit = function (id) {
            ApiService.postModel(ApiEndpoint.Models.RESPONSES + "/" + $routeParams.id, $scope.responses).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $location.path("/responses" + '/' + $scope.responses.question_id);
                    alertService.success("Success", "Answer Details Edit Successfully.");
                }
            })
        };

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
                            alertService.success("Success", "Answer Deleted Successfully");
                            window.location.reload();
                            // loadResponsesInfo();
                        }
                    });
                }
            });
        };

    });  
