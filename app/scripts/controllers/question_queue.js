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
    .controller('QuestionQueueCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.questionsinfo = [];
        $scope.questionscatinfo = [];
        $scope.is_edit = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        $scope.sub_id = $routeParams.id;
        $scope.limitVal = false;

        // List Question
        var loadQuestionInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "subcat_name": $routeParams.id,
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.QUESTIONS, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.questionsinfo = response.data.data;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadSubcategoryInfo();
                }
            });
        };
        loadQuestionInfo();

        var loadSubcategoryInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "_id": $routeParams.id,
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.SUBCATEGORY, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.questionscatinfo = response.data.data;
                    $scope.questionCat_id = $scope.questionscatinfo[0].ques_cat._id;
                    $scope.subcat_name = $scope.questionscatinfo[0].ques_cat.name;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                }
            });
        };

        $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[1-9][0-9]/g, '10');
            $(this).val($(this).val().replace(/[1-9][0-9]/g, '10'));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $(".allownumeric").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[1-9][0-9]/g, '');
            $(this).val($(this).val().replace(/[1-9][0-9]/g, ''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $scope.questions = {};


        $scope.AddQuestion = function () {
            if ($scope.questions.limit >= $scope.questions.optionvalue) {
                return false;
            }
            if (!$scope.questions.limit) {
                $scope.questions.limit = "1";
            }

            var json = {
                "question": $scope.questions.question,
                "ques_cat": $scope.questionCat_id,
                "subcat_name": $routeParams.id,
                "answer_type": $scope.questions.answer_type,
                "optionvalue": $scope.questions.optionvalue,
                "limit": $scope.questions.limit
            }
            ApiService.putModel(ApiEndpoint.Models.QUESTIONS, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.questionsinfo.push($scope.questions);
                    $location.path("/question_queue" + '/' + $routeParams.id);
                    alertService.success("Success", "Question Added Successfully.");
                }
            })
        };

        // Edit Question
        $scope.editQuestions = function (url) {
            $location.path(url);
        };

        // Get edit data        
        if ($routeParams.id != '') {

            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.QUESTIONS, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {

                    if (response.data != null) {
                        $scope.is_edit = true;
                        $scope.questions = response.data;
                    }
                }
            });
        }

        // Edit data
        $scope.UpdateQuestion = function (id) {
            ApiService.postModel(ApiEndpoint.Models.QUESTIONS + "/" + $routeParams.id, $scope.questions).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $location.path("/question_queue" + '/' + $scope.questions.subcat_name._id);
                    alertService.success("Success", "Question Details Edit Successfully.");
                }
            })
        };

        // Edit Question
        $scope.GoToAnswer = function (url) {
            $location.path(url);
        };

        // Delete Question 
        $scope.deleteData = function (que) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete question?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    var json = {
                        "question_id": que._id
                    }
                    ApiService.postModelWQ(ApiEndpoint.Models.QUESTIONDELETE, json).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            alertService.success("Success", "Question Deleted Successfully");
                            // loadQuestionInfo();
                            $route.reload();
                        }
                    });
                }
            });
        };

    });  
