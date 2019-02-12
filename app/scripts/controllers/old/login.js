'use strict';

/**
 * @ngdoc function
 * @name vdateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the vdateApp
 */
angular.module('vdateApp')
    .controller('LoginCtrl', function ($rootScope, $scope, AuthenticationService, alertService, ApiEndpoint, api, $http) {
        AuthenticationService.ClearCredentials();
        $scope.dataLoading = false;
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                console.log(response);
                if (response.is_error === false) {
                    var user = response.data.user;
                    console.log(response.data);
                    if (user.type == "member") {
                        alertService.error("You are not authorized to login!");
                    } else {
                        AuthenticationService.SetCredentials(response.data);
                        var url = window.location.href;
                        if (url.indexOf('login.html') > 0) {
                            url = url.replace('login.html', '');
                            window.location.href = url;
                        } else {
                            window.location.href = '/#/dashborad';
                        }
                    }
                } else {
                    alertService.error(response.message);
                }
                $scope.dataLoading = false;
            });
        };

        $scope.forgotPassword = function () {

            if ($scope.email) {
                $.SmartMessageBox({
                    title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Forgot Password <span class='txt-color-orangeDark'></span> ?",
                    content: "Are you sure want to generate new password ? New password will be sent to your email address.",
                    buttons: '[No][Yes]'

                }, function (ButtonPressed) {
                    if (ButtonPressed == "Yes") {
                        api.post(ApiEndpoint.getUrl(ApiEndpoint.URLS.FORGOT_PASSWORD), { email: $scope.email }).then(function (response) {
                            if (response.is_error) {
                                alertService.error(response.message);
                            } else {
                                alertService.error("Email is sent with new password.");
                            }
                        });
                    }
                });
            } else {
                alertService.error("Please enter your Email.");
            }
        }

        $scope.passwordreset = function (resetpassform) {
            if (resetpassform.$valid) {
                $scope.reset_submit = true;
                $scope.param = {};
                var urlgettoken = window.location.search.substring(1);
                var vars = urlgettoken.split("=");
                var token = vars[1];
                var is_error = false;

                if (!$scope.password) {
                    alertService.error("New password can not be blank.");
                    $scope.reset_submit = false;
                    is_error = true;
                } else if (!$scope.confirmpassword) {
                    alertService.error("Confirm password can not be blank.");
                    $scope.reset_submit = false;
                    is_error = true;
                } else if ($scope.password !== $scope.confirmpassword) {
                    alertService.error("New and confirm password does not match");
                    $scope.reset_submit = false;
                    is_error = true;
                }
                if (!is_error) {
                    console.log('there');
                    $scope.param.new_password = $scope.password;
                    $scope.param.token = token;

                    api.post(ApiEndpoint.getUrl(ApiEndpoint.URLS.CHANGE_PASSWORD), $scope.param).then(function (response) {
                        if (response.is_error) {
                            $scope.reset_submit = false;
                            alertService.error(response.message);

                        } else {
                            $scope.reset_submit = false;
                            $scope.password = "";
                            $scope.confirmpassword = "";
                            alertService.success("Success", "Password Change Successfully");
                            window.location.href = '/login.html';
                        }
                    });
                }
            }
        }

    });
