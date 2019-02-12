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
    .controller('ManageQuestCatCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.ques_catinfo = [];
        $scope.questionsinfo = [];
        $scope.subcatinfo = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.apiendpoint = ApiEndpoint;
        $scope.loading = true;
        $scope.ques_cat_id = '';
        $scope.is_disabled = false;
        $scope.activeclass = -1;
        $scope.buttonHide = false;
        $scope.activeclass = $rootScope.globals.index;
        // console.log('$scope', $scope.activeclass);
        if ($scope.activeclass === undefined) {
            $scope.activeclass = -1;
        }
        // var classActive = $cookieStore.get('index');
        // console.log('classActive', classActive);

        $scope.updateIndex = function (index) {
            $scope.activeclass = index;
            $rootScope.globals.index = index;
        }
        var loadQues_CatInfo = function () {
            var json = {
                "where": {
                    "is_deleted": false
                },
                "sort": { "create_date": "-1" },
            }
            $scope.loading = true;
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.QUES_CAT, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    
                    $scope.ques_catinfo = response.data.data;
                    if ($scope.ques_catinfo.length < 4) {
                        $scope.buttonHide = false;
                    } else {
                        $scope.buttonHide = true;
                    }
                    // if ($scope.ques_catinfo.length == '4') {
                    //     $scope.is_disabled = true;
                    // }
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    if ($scope.activeclass != -1) {
                        var index = $scope.activeclass
                        $scope.loadSubCatinfo(index);
                    }

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
                            alertService.success("Success", "Question category detail deleted successfully");
                            window.location.reload();
                            // loadQues_CatInfo();
                        }
                    });
                }
            });
        };



        $scope.ques_cat = {};

        // Add Question categorie
        $scope.AddQue_cat = function () {
            ApiService.putModel(ApiEndpoint.Models.QUES_CAT, $scope.ques_cat).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.ques_catinfo.push($scope.ques_cat);
                    $location.path("/questionnaire");
                    alertService.success("Success", "Question category detail added successfully");
                }
            })
        };

        // Edit Question categorie
        $scope.editQues_Cat = function (url) {
            $location.path(url);
        };

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.QUES_CAT, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    if (response.data != null) {
                        $scope.is_edit = true;
                        $scope.ques_cat = response.data;
                    }
                }
            });
        }

        // Edit data
        $scope.editQue_Cat = function (id) {
            ApiService.postModel(ApiEndpoint.Models.QUES_CAT + "/" + $routeParams.id, $scope.ques_cat).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/questionnaire");
                    alertService.success("Success", "Question category detail updated successfully");
                }
            })
        };

        // List Subcategory
        $scope.loadSubCatinfo = function (index) {
            $rootScope.globals.index = index;
            if ($rootScope.globals.index) {
                $scope.activeclass = $rootScope.globals.index;
                index = $rootScope.globals.index;
            } else {
                $scope.activeclass = index;
            }
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
                    if (!response.data.data) {
                        $scope.loading = true;
                    } else {
                        $scope.subcatinfo = response.data.data;
                        $scope.ques_cat_id = $scope.ques_catinfo[index]._id;
                        $scope.ques_cat_name = $scope.ques_catinfo[index].name;
                        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                        $scope.loading = false;
                    }

                }
            });
        };
        $scope.editSub_Cat = function (url) {
            $location.path(url);
        };

        // Delete Question 
        $scope.deleteDataSub = function (sub) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete subcategory?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    var json = {
                        "subcate_id" : sub._id
                    }
                    ApiService.postModelWQ(ApiEndpoint.Models.SUBCATDELETE, json).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            alertService.success("Success", "Subcategory Deleted Successfully");
                            $route.reload();
                        }
                    });
                }
            });
        };
    });  
