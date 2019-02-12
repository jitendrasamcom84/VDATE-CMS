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

    .controller('ManageMemberCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $rootScope, AddressService, $location, api) {
        $scope.userinfo = [];
        $scope.is_edit = false;
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        var loadUserInfo = function () {
            ApiService.getModel(ApiEndpoint.Models.USER).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo = response.data;
                }
            });
        };
        loadUserInfo();

        $scope.sendForm = function () {
            $scope.msg = "Form Validated";
        };

        $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[^0-9\.]/g, '');
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $scope.deleteData = function (user) {
            $.SmartMessageBox({
                title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
                content: "Are you sure want to delete member?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {

                    ApiService.softDeleteModel(ApiEndpoint.Models.USER, user._id).then(function (response) {
                        if (response.is_error) {
                            alertService.error(response.message);
                        } else {
                            alertService.success("Success", "Member Deleted Successfully");
                            loadUserInfo();
                        }
                    });
                }
            });
        };

        $scope.editMember = function (url) {
            $location.path(url);
        };
        $scope.viewMember = function (url, id) {
            $location.path(url);
        };
        $scope.user = {};
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        $scope.popup1 = {
            opened: false
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.dateOptions = {
            maxDate: new Date(),
            startingDay: 1
        };

        // Add Member
        $scope.submit = function () {
            var ts = $scope.user.profile_pic;
            if (typeof $scope.user.profile_pic === 'object') {
                upload($scope.user.profile_pic, $scope.user);
            }
            else if ($scope.user.profile_pic.indexOf("http") != 0)
                upload($scope.user.profile_pic, $scope.user);
            else {
                ApiService.postModelWQ(ApiEndpoint.URLS.USER_REGISTER, $scope.user).then(function (response) {

                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.userinfo.push($scope.user);
                        $location.path("/member");
                        alertService.success("Success", "Member Added Successfully");
                    }
                });
            }
        };

        // Profile Pic Upload
        var upload = function (file, user) {
            var data = {
                file: file
            }
            Upload.upload({
                url: ApiEndpoint.BaseUrl + 'image/upload',
                data: data,
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json'
                }
            }).then(function (resp) {

                if (resp.data.is_error === false) {
                    var obj = resp.data.data;
                    if ($scope.is_edit == false) {
                        $scope.user.profile_pic = upload_path + obj.file_name;
                        ApiService.postModelWQ(ApiEndpoint.URLS.USER_REGISTER, $scope.user).then(function (response) {
                            if (response.data.is_error) {
                                alertService.error(response.data.message);
                            } else {
                                $scope.userinfo.push($scope.user);
                                $location.path("/member");
                                alertService.success("Success", "Member Added Successfully");
                            }
                        });
                    } else {
                        $scope.user.profile_pic = upload_path + obj.file_name;
                        ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, $scope.user).then(function (response) {
                            if (response.data.is_error) {
                                alertService.error(response.data.message);
                            } else {
                                $location.path("/member");
                                alertService.success("Success", "Member Details Edit Successfully.");
                            }
                        })
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        // Get edit data
        if ($routeParams.id != '') {
            var id = $routeParams.id;
            ApiService.getModelById(ApiEndpoint.Models.USER, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                }
                else {
                    $scope.is_edit = true;
                    $scope.user = response.data;
                    $scope.user.profile_image = $scope.user.profile_pic;
                    $scope.user.password = $scope.user.hashedPassword;
                    $scope.user.birth_date = new Date($scope.user.birth_date);
                    $scope.user.isavailable_for_chat = ($scope.user.isavailable_for_chat == true) ? "1" : "0";
                    $scope.user.isautofriend = ($scope.user.isautofriend == true) ? "1" : "0";
                }
            });
        }
        // Get data
        if ($routeParams.id != '') {
            var ids = $routeParams.id;
            $scope.membershipinfo = [];
            var loadMembershipInfo = function () {
                var json = {
                    "where": {
                        "user_id": ids,
                        "is_deleted": false

                    }
                }
                ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.MEMBERSHIP, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.membershipinfo = response.data.data[0];
                        var dateone = new Date($scope.membershipinfo.create_date);
                        var datetwo = new Date();
                        var dayDif = Math.round((datetwo - dateone) / 1000 / 60 / 60 / 24);
                        $scope.membershipinfo.RemainingDays = $scope.membershipinfo.package.duration - dayDif
                    }
                });
            };

            $scope.appfriendsinfo = [];
            var loadAppFriendsInfo = function () {
                var json = {
                    "where": {
                        "user_id": ids,
                        "is_deleted": false
                    }
                }
                ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.APPFRIENDS, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {

                        $scope.appfriendsinfo1 = response.data.data;
                        $scope.appfriendsinfo = _.map($scope.appfriendsinfo1, function (value) {
                            return value.friend_id;
                        });

                    }
                });
            };

            $scope.favoritesinfo = [];
            var loadFavoritesInfo = function () {
                var json = {
                    "where": {
                        "user_id": ids,
                        "is_deleted": false

                    }
                }
                ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.FAVORITES, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {

                        $scope.favoritesinfo1 = response.data.data;
                        $scope.favoritesinfo = _.map($scope.favoritesinfo1, function (value) {
                            return value;
                        });

                    }
                });
            };

            $scope.blockedusersinfo = [];
            var loadBlockedUsersInfo = function () {
                var json = {
                    "where": {
                        "user_id": ids,
                        "is_deleted": false

                    }
                }
                ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.BLOCKEDUSERS, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {

                        $scope.blockedusersinfo1 = response.data.data;
                        $scope.blockedusersinfo = _.map($scope.blockedusersinfo1, function (value) {
                            return value;
                        });

                    }
                });
            };
            loadBlockedUsersInfo();
            loadFavoritesInfo();
            loadMembershipInfo();
            loadAppFriendsInfo();
        }


        // Edit data
        $scope.editSubmit = function () {
            if ($scope.user.profile_pic.name) {
                upload($scope.user.profile_pic, $scope.user);
            }
            else {
                ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, $scope.user).then(function (response) {

                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $location.path("/member");
                        alertService.success("Success", "Member Details Edit Successfully.");
                    }
                })
            }
        };
    });        