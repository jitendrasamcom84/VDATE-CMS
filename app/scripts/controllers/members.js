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

    .controller('ManageMemberCtrl', function (Upload, $scope, ApiService, ApiEndpoint, $filter, $sce, $resource, _, alertService, $routeParams, $route, $rootScope, AddressService, $location, api, DTOptionsBuilder, DTColumnDefBuilder, socket) {
        $scope.userinfo = [];
        $scope.packageinfo = [];
        $scope.is_edit = false;
        $scope.buttonShow = false;
        $scope.no_of_messages = '';
        var upload_path = ApiEndpoint.ServerUrl + 'api/image/get/';
        $scope.apiendpoint = ApiEndpoint;
        $scope.minDateMoment = moment().subtract(0, 'day');
        $scope.minDateString = moment().subtract(0, 'day').format('YYYY-MM-DD');
        $scope.minYear = moment().subtract(18, 'year').format('YYYY-MM-DD');
        $scope.loading = true;
        $scope.firstname = false;
        $scope.lastname = false;
        $scope.email = false;
        $scope.gender = false;
        $scope.birthdate = false;
        $scope.phonenumber = false;
        $scope.profilepic = false;
        $scope.register_time = false;
        $scope.occup = false;
        $scope.educations = false;
        $scope.hairs = false;
        $scope.age = false;
        $scope.eyes = false;
        $scope.heights = false;
        $scope.marital_status = false;
        $scope.is_online = false;
        $scope.active = false;
        $scope.children = false;
        $scope.place = false;
        $scope.relocation = false;
        $scope.habit = false;
        $scope.smoking_habit = false;
        $scope.religion = false
        $scope.sector = false;
        $scope.body_structure = false;
        $scope.is_visible = false;
        $scope.User_id = $rootScope.globals.currentUser.data.user._id;
        $scope.ShowPopup = false;
        $scope.ClosePopup = false;
        $scope.buttonDisabled = false;
        socket.on('connect', function () { });

        var joinRoom = function () {
            socket.emit('online', { "room": $scope.currentUser.id });
        }
        var loadUserInfo = function () {
            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                },
                "with": [{
                    "model": "Membership",
                    "source": "_id",
                    "destination": "user_id",
                    "include_deleted": false,
                    "sort": -1,
                    "json_key": "Subscription",
                    "count": false
                }]
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.USER, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.userinfo = response.data.data;
                    $scope.currentUser = $scope.userinfo;
                    joinRoom();
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', []);
                    $scope.loading = false;
                    loadPackagesInfo();
                }
            });
        };
        loadUserInfo();

        var loadPackagesInfo = function () {

            var json = {
                "sort": { "create_date": "-1" },
                "where": {
                    "is_deleted": false
                }
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.PACKAGES, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.packageinfo = response.data.data;
                }
            });
        };

        // socket on
        socket.on('clientconnected', function (data) {
            console.log('connected', data.room);
            if ($scope.user._id == data.room) {
                $scope.user.is_online = true;
                console.log('online', $scope.user.is_online);
            }
        });

        socket.on('clientdisconnect', function (data) {
            console.log('disconnect', data.room);
            if ($scope.user._id == data.room) {
                $scope.user.is_online = false;
                console.log('offline', $scope.user.is_online);
            }
        });

        $scope.checkdate = function (coupon) {
            var todaydate = $filter('date')(new Date(), 'yyyy-MM-dd');
            var expiredate = $filter('date')(coupon.expire_date, 'yyyy-MM-dd ');

            if (expiredate < todaydate) {
                return false;
            } else {
                return true;
            }
        };

        $scope.editable = function (id) {
            switch (id) {
                case 0:
                    $scope.firstname = $scope.firstname == true ? false : true;
                    break;
                case 1:
                    $scope.lastname = $scope.lastname == true ? false : true;
                    break;
                case 2:
                    $scope.email = $scope.email == true ? false : true;
                    break;
                case 3:
                    $scope.gender = $scope.gender == true ? false : true;
                    break;
                case 4:
                    $scope.birthdate = $scope.birthdate == true ? false : true;
                    break;
                case 5:
                    $scope.phonenumber = $scope.phonenumber == true ? false : true;
                    break;
                case 6:
                    $scope.profilepic = $scope.profilepic == true ? false : true;
                    break;
                case 7:
                    $scope.occup = $scope.occup == true ? false : true;
                    break;
                case 8:
                    $scope.educations = $scope.educations == true ? false : true;
                    break;
                case 9:
                    $scope.hairs = $scope.hairs == true ? false : true;
                    break;
                case 10:
                    $scope.age = $scope.age == true ? false : true;
                    break;
                case 11:
                    $scope.eyes = $scope.eyes == true ? false : true;
                    break;
                case 12:
                    $scope.heights = $scope.heights == true ? false : true;
                    break;
                case 13:
                    $scope.marital_status = $scope.marital_status == true ? false : true;
                    break;
                case 14:
                    $scope.active = $scope.active == true ? false : true;
                    break;
                case 15:
                    $scope.children = $scope.children == true ? false : true;
                    break;
                case 16:
                    $scope.place = $scope.place == true ? false : true;
                    break;
                case 17:
                    $scope.relocation = $scope.relocation == true ? false : true;
                    break;
                case 18:
                    $scope.habit = $scope.habit == true ? false : true;
                    break;
                case 19:
                    $scope.smoking_habit = $scope.smoking_habit == true ? false : true;
                    break;
                case 20:
                    $scope.religion = $scope.religion == true ? false : true;
                    break;
                case 21:
                    $scope.sector = $scope.sector == true ? false : true;
                    break;
                case 22:
                    $scope.body_structure = $scope.body_structure == true ? false : true;
                    break;
                case 23:
                    $scope.is_visible = $scope.is_visible == true ? false : true;
                    break;
                default:
                    $scope.firstname == false;
                    $scope.lastname == false;
                    $scope.email == false;
                    $scope.gender = false;
                    $scope.birthdate = false;
                    $scope.phonenumber = false;
                    $scope.profilepic = false;
                    $scope.occup = false;
                    $scope.educations = false;
                    $scope.hairs = false;
                    $scope.age = false;
                    $scope.eyes = false;
                    $scope.heights = false;
                    $scope.marital_status = false;
                    $scope.active = false;
                    $scope.children = false;
                    $scope.place = false;
                    $scope.relocation = false;
                    $scope.habit = false;
                    $scope.smoking_habit = false;
                    $scope.religion = false;
                    $scope.sector = false;
                    $scope.body_structure = false;
                    break;
            }
        };


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

        $('.allowcharacter').keypress(function (event) {
            // var regex = new RegExp("^[a-zA-Z]+$");
            // var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            // if (regex.test(str)) {
            //     return true;
            // }
            // else {
            //     e.preventDefault();
            //     return false;
            // }
            var k;
            document.all ? k = event.keyCode : k = event.which;
            return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || (k >= 1488 && k <= 1513));
        });

        $(".heigth").on("keypress keyup blur", function (event) {
            this.value = this.value.replace(/[^1-9\.]/g, '');
            $(this).val($(this).val().replace(/[^1-9\.]/g, ''));
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
                            window.location.reload();
                            // loadUserInfo();
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

        $scope.change = function () {
            $scope.loading = true;
            var image_display = $scope.user.profile_pic;
            $scope.user.profile_pic = $scope.user.profile_image;
            if (image_display) {
                upload(image_display, $scope.user);
            }

        }

        // Add Member
        $scope.submit = function () {
            $scope.loading = true;
            $scope.buttonDisabled = true;
            var ts = $scope.user.profile_pic;
            // if (typeof $scope.user.profile_pic === 'object') {
            //     upload($scope.user.profile_pic, $scope.user);
            // }
            // else if ($scope.user.profile_pic.indexOf("http") != 0)
            //     upload($scope.user.profile_pic, $scope.user);
            // else {
            ApiService.postModelWQ(ApiEndpoint.URLS.USER_REGISTER, $scope.user).then(function (response) {

                if (response.data.is_error) {
                    alertService.error(response.data.message);
                    $scope.buttonDisabled = false;
                } else {
                    $scope.userinfo.push($scope.user);
                    $location.path("/member");
                    alertService.success("Success", "Member Added Successfully");
                    $scope.buttonDisabled = false;
                    $scope.loading = false;
                }
            });
            // }
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
                        $scope.user.profile_image = upload_path + obj.file_name;
                        $scope.loading = false;
                        // ApiService.postModelWQ(ApiEndpoint.URLS.USER_REGISTER, $scope.user).then(function (response) {
                        //     if (response.data.is_error) {
                        //         alertService.error(response.data.message);
                        //         $scope.buttonDisabled = false;
                        //     } else {
                        //         $scope.userinfo.push($scope.user);
                        //         $location.path("/member");
                        //         alertService.success("Success", "Member Added Successfully");
                        //         $scope.buttonDisabled = false;
                        //     }
                        // });
                    } else {
                        $scope.user.profile_pic = upload_path + obj.file_name;
                        $scope.user.profile_image = upload_path + obj.file_name;
                        $scope.loading = false;
                        // ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, $scope.user).then(function (response) {
                        //     if (response.data.is_error) {
                        //         alertService.error(response.data.message);
                        //         $scope.buttonDisabled = false;
                        //     } else {
                        //         if ($scope.register_time == false) {
                        //             // $route.reload();
                        //             $scope.user = response.data.data;
                        //         } else {
                        //             $location.path("/member");
                        //         }
                        //         alertService.success("Success", "Member Details Edit Successfully.");
                        //         $scope.buttonDisabled = false;
                        //     }
                        // })
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };



        var uploadupdate = function (file, user) {
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
                                $scope.buttonDisabled = false;
                            } else {
                                $scope.userinfo.push($scope.user);
                                $location.path("/member");
                                alertService.success("Success", "Member Added Successfully");
                                $scope.buttonDisabled = false;
                            }
                        });
                    } else {
                        $scope.user.profile_pic = upload_path + obj.file_name;
                        $scope.user.profile_image = upload_path + obj.file_name;
                        ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, $scope.user).then(function (response) {
                            if (response.data.is_error) {
                                alertService.error(response.data.message);
                                $scope.buttonDisabled = false;
                            } else {
                                $scope.user = response.data.data;
                                alertService.success("Success", "Member Details Edit Successfully.");
                                $scope.buttonDisabled = false;
                            }
                        })
                    }
                }
            }, function (resp) {
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        $scope.message = [];

        // Get edit data
        if ($routeParams.id) {
            $scope.buttonShow = true;
            var id = $routeParams.id;
            var json = {
                "where": {
                    "_id": id,
                    "is_deleted": false
                },
                "populate": "subscription"
            }
            ApiService.getModelById(ApiEndpoint.Models.USER, id).then(function (response) {
                if (response.is_error) {
                    // alertService.error(response.message);
                } else {
                    loadPackagesInfo();
                    $scope.is_edit = true;
                    $scope.user = response.data;
                    // $scope.PackageName = $scope.user.subscription;
                    if ($scope.user.subscription) {
                        $scope.user.subscription = $scope.user.subscription._id;
                    }
                    $scope.user.profile_image = $scope.user.profile_pic;
                    $scope.user.password = $scope.user.hashedPassword;
                    var birthdate = $filter('date')(response.data.birth_date, "yyyy-MM-dd");
                    $scope.userform.birth_date.stringDate = birthdate;

                    /* start age calculate */
                    var birthday = new Date(birthdate);
                    var today = new Date();
                    var age = ((today - birthday) / (31557600000));
                    $scope.user.m_age = Math.floor(age);
                    /* end age calculate */

                    $scope.register_time = $filter('date')($scope.user.create_date, "hh:mm a");
                    $scope.user.relocation = ($scope.user.relocation == 2) ? "2" : "1";
                    $scope.user.is_visible_profile = ($scope.user.is_visible_profile == "Public") ? "Public" : "";
                    $scope.user.isavailable_for_chat = ($scope.user.isavailable_for_chat == true) ? "1" : "0";
                    $scope.user.isautofriend = ($scope.user.isautofriend == true) ? "1" : "0";

                    $scope.GetmessageCount();
                }
            });
            // var json = {
            //     // "user_id": $scope.user_id,
            //     "friend_id": id,
            //     "type": "adminmessage",
            // }
            // ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
            //     if (response.is_error) {
            //         // alertService.error(response.message);
            //     }
            //     else {
            //         $scope.is_edit = true;
            //         $scope.message = response.data;
            //         console.log('$scope.message', $scope.message);
            //     }
            // });
        }

        // Get data
        if ($routeParams.id) {
            var ids = $routeParams.id;
            $scope.membershipinfo = [];
            var loadMembershipInfo = function () {
                var json = {
                    "where": {
                        "user_id": ids,
                        "package": $scope.user.subscription,
                        "is_active": true,
                        "is_deleted": false

                    }
                }
                ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.MEMBERSHIP, json).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        $scope.membershipinfo = response.data.data[0];
                        if ($scope.membershipinfo) {
                            var dateone = new Date($scope.membershipinfo.create_date);
                            var datetwo = new Date();
                            $scope.expiryedate = moment(dateone).add($scope.membershipinfo.duration, 'day').format('DD/MM/YYYY hh:mm a');
                            var dayDif = Math.round((datetwo - dateone) / 1000 / 60 / 60 / 24);
                            $scope.membershipinfo.RemainingDays = $scope.membershipinfo.duration - dayDif
                        }
                    }
                });
            };

            // $scope.appfriendsinfo = [];
            // var loadAppFriendsInfo = function () {
            //     var json = {
            //         "where": {
            //             "user_id": ids,
            //             "is_deleted": false
            //         }
            //     }
            //     ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.APPFRIENDS, json).then(function (response) {
            //         if (response.data.is_error) {
            //             alertService.error(response.data.message);
            //         } else {

            //             $scope.appfriendsinfo1 = response.data.data;
            //             $scope.appfriendsinfo = _.map($scope.appfriendsinfo1, function (value) {
            //                 return value.friend_id;
            //             });

            //         }
            //     });
            // };

            // $scope.favoritesinfo = [];
            // var loadFavoritesInfo = function () {
            //     var json = {
            //         "where": {
            //             "user_id": ids,
            //             "is_deleted": false

            //         }
            //     }
            //     ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.FAVORITES, json).then(function (response) {
            //         if (response.data.is_error) {
            //             alertService.error(response.data.message);
            //         } else {

            //             $scope.favoritesinfo1 = response.data.data;
            //             $scope.favoritesinfo = _.map($scope.favoritesinfo1, function (value) {
            //                 return value;
            //             });

            //         }
            //     });
            // };

            // $scope.blockedusersinfo = [];
            // var loadBlockedUsersInfo = function () {
            //     var json = {
            //         "where": {
            //             "user_id": ids,
            //             "is_deleted": false

            //         }
            //     }
            //     ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.BLOCKEDUSERS, json).then(function (response) {
            //         if (response.data.is_error) {
            //             alertService.error(response.data.message);
            //         } else {

            //             $scope.blockedusersinfo1 = response.data.data;
            //             $scope.blockedusersinfo = _.map($scope.blockedusersinfo1, function (value) {
            //                 return value;
            //             });

            //         }
            //     });
            // };
            // loadBlockedUsersInfo();
            // loadFavoritesInfo();
            loadMembershipInfo();
            // loadAppFriendsInfo();
        }


        // Edit data
        $scope.editSubmit = function () {
            $scope.loading = true;
            if ($scope.user.phone_number) {
                if ($scope.user.phone_number.length < 6) {
                    alertService.error('Please enter atleast 6 digit number');
                    return;
                }
                if ($scope.user.phone_number.length > 15) {
                    alertService.error('Please enter maximum 15 digit number');
                    return;
                }
            }
            if ($scope.user.profile_pic.name) {
                uploadupdate($scope.user.profile_pic, $scope.user);
            } else {
                ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, $scope.user).then(function (response) {
                    if (response.data.is_error) {
                        alertService.error(response.data.message);
                    } else {
                        var birthdate = $filter('date')($scope.user.birth_date, "yyyy-MM-dd");
                        $scope.userform.birth_date.stringDate = birthdate;
                        $scope.user = response.data.data;
                        $scope.user.relocation = (response.data.data.relocation == 2) ? "2" : "1";
                        alertService.success("Success", "Member Details Edit Successfully.");
                        $scope.loading = false;
                    }
                })
            }
        };

        $scope.memberUpdate = function () {
            $scope.loading = true;
            $scope.buttonDisabled = true;
            // if ($scope.user.profile_pic.name) {
            //     upload($scope.user.profile_pic, $scope.user);
            // } else {
            ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, $scope.user).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $location.path("/member");
                    alertService.success("Success", "Member Details Edit Successfully.");
                    $scope.buttonDisabled = false;
                    $scope.loading = true;
                }
            })
            // }
        };

        $scope.blockUnblock = function () {
            if ($scope.user.active == false) {
                var json = {
                    "active": true
                }
            } else {
                var json = {
                    "active": false
                }
            }
            ApiService.postModel(ApiEndpoint.Models.USER + "/" + $routeParams.id, json).then(function (response) {
                if (response.data.is_error) {
                    alertService.error(response.data.message);
                } else {
                    $scope.user = response.data.data;
                    if ($scope.user.active == true) {
                        alertService.success("Success", "Member Unblock Successfully.");
                    } else {
                        alertService.success("Success", "Member Block Successfully.");
                    }

                }
            })
        };

        /* Message Popup */
        $scope.openpopup = function (data) {
            $scope.ShowPopup = !$scope.ShowPopup;
            $scope.ClosePopup = false;
            $scope.messageData = data;
            $scope.message = '';
        }

        $scope.hidePopup = function () {
            $scope.ClosePopup = !$scope.ClosePopup;
            $scope.ShowPopup = !$scope.ShowPopup;

        }

        $scope.sendMessage = function (message) {
            if (message == null || message == '' || message.trim() == '') {
                alertService.error('Please Enter Message');
                return false;
            }
            var json = {
                "user_id": $scope.User_id,
                "friend_id": $scope.messageData._id,
                "type": "adminmessage",
                "message": message
            }
            ApiService.putModel(ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.GetmessageCount();
                    $scope.hidePopup();
                    alertService.success("Success", "Message Send Successfully.");
                }
            })
        }

        $scope.GetmessageCount = function () {
            var json = {
                "where": {
                    "friend_id": $routeParams.id,
                    "type": "adminmessage"
                },
                "count": true
            }
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.NOTIFICATION, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    $scope.no_of_messages = response.data.data;
                }
            })
        }
    });        