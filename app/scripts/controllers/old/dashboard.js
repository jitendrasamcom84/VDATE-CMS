'use strict';

/**
 * @ngdoc function
 * @name minnazWeb.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the minnazWeb
 */

angular.module('vdateApp')
    .controller('DashboardCtrl', function ($scope, alertService, $rootScope, $location, ApiService, ApiEndpoint, AuthenticationService, $uibModal, api) {
        $scope.apiendpoint = ApiEndpoint;
        if ($rootScope.globals.currentUser) {
            $scope.current_user = $rootScope.globals.currentUser.data.user;
        }
        $scope.name = function () {
            if ($rootScope.globals.currentUser) {
                if (localStorage.getItem('userdata')) {
                    $scope.userinfo = JSON.parse(localStorage.getItem('userdata'));
                    return $scope.userinfo.first_name + ' ' + $scope.userinfo.last_name
                } else {
                    return $rootScope.globals.currentUser.data.user.first_name + ' ' + $rootScope.globals.currentUser.data.user.last_name
                }
            }
            return;
        };

        $scope.profileimage = function () {
            if ($rootScope.globals.currentUser) {
                if (localStorage.getItem('userdata')) {
                    $scope.userinfo = JSON.parse(localStorage.getItem('userdata'));
                    if ($scope.userinfo.avatar) {
                        var path = ApiEndpoint.BaseUrl + 'image/get/' + $scope.userinfo.avatar;
                        return path;
                    } else {
                        return 'img/user_img.jpg';
                    }
                } else {
                    return 'img/user_img.jpg';
                }
            }
            return '';
        };

        $scope.islogin = function () {
            if ($rootScope.globals.currentUser) {
                return true;
            } else {
                return false;
            }
        };
        $scope.selectData = '';
        /* class data load */
        var loadclass = function () {
            var json = {
                where: { is_deleted: false, teachers: $scope.current_user._id, school: $scope.current_user.school }
            };
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.CLASS, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    if (response.data) {
                        if (response.data.length > 0) {
                            $scope.classlist = response.data;
                        }
                    }
                }
            });
        };
        var loadstudent = function () {
            var json = {
                where: { is_deleted: false, role: 'student', is_verify: true, school: $scope.current_user.school }
            };
            ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.USER, json).then(function (response) {
                if (response.is_error) {
                    alertService.error(response.message);
                } else {
                    if (response.data) {
                        if (response.data.length > 0) {
                            $scope.students = response.data;
                            $scope.copystudents = angular.copy(response.data);
                        } else {
                            $scope.students = [];
                        }
                    }
                }
            });
        };
        if ($scope.current_user) {
            loadclass();
            loadstudent();
        }
        /* user data load */
        $scope.classset = false;
        $scope.selectClass = function (data) {
            if (data) {
                $scope.class_id = data;
                $scope.user_id = '';
                $scope.students = _.filter($scope.copystudents, { 'classId': data });
                $scope.selctedData.student = null;
                var selecteddata = _.filter($scope.classlist, { '_id': data });
                if (selecteddata[0]) {
                    $scope.selectData = selecteddata[0].name;
                }
                $scope.classset = true;
                $scope.selectDatastud = '';
            } else {
                $scope.class_id = '';
                $scope.user_id = '';
                $scope.selctedData.student = null;
                $scope.students = $scope.copystudents;
                $scope.classset = false;
                $scope.selectData = '';
                $scope.selectDatastud = '';
            }
            loadChart();
        };
        /* */
        $scope.selectStudent = function (data) {
            if (data) {
                $scope.user_id = data;
                var datafind = _.filter($scope.copystudents, { '_id': data });
                if (datafind.length > 0) {
                    $scope.class_id = datafind[0].classId;
                    $scope.selectDatastud = datafind[0].user_name;
                }
            } else {
                $scope.user_id = data;
                $scope.selectDatastud = '';
                if (!$scope.classset) {
                    $scope.selectData = '';
                    $scope.class_id = data;
                } else {
                    var selecteddata = _.filter($scope.classlist, { '_id': $scope.class_id });
                    if (selecteddata[0]) {
                        $scope.selectData = selecteddata[0].name;
                    }
                }
            }
            loadChart();
        };
        /* Chart data load */
        var loadChart = function () {
            var json = {
                user_id: $scope.user_id ? $scope.user_id : '',
                class_id: $scope.class_id ? $scope.class_id : '',
                school_id: $scope.current_user ? $scope.current_user.school : ''
            };
            api.post(ApiEndpoint.getUrl(ApiEndpoint.URLS.DESHDATA), json).then(function (response) {
                if (response.is_error) {
                    console.log(response);
                } else {
                    if (response.data) {
                        var labelsFinalCat = [];
                        var LogCountFinalCat = [];
                        var wordCountFinalCat = [];
                        var LogCountdata = [];
                        _.map(response.data.final_cats, function (o) {
                            labelsFinalCat.push(o.name);
                            wordCountFinalCat.push(o.words_count);
                            LogCountFinalCat.push(o.log_count);
                            var decksData = Math.round((o.log_count * 100) / o.words_count);
                            var setdeckData = decksData ? decksData : 0;
                            LogCountdata.push(setdeckData);
                        });

                        /* START : Daily progress data */
                        var sumFinalCat = _.sum(LogCountFinalCat);
                        var sumWordCount = _.sum(wordCountFinalCat);
                        var dif = Math.round((sumFinalCat * 100) / sumWordCount);

                        $scope.DailyProgressLabels = ['word', 'log'];
                        $scope.totaldailyreport = sumFinalCat;
                        $scope.DailyProgressdata = [$scope.totaldailyreport, dif];
                        /* END : Daily progress data */

                        /* START : deck progress data */
                        var sumFinaldek = _.sum(LogCountdata);
                        $scope.totaldeckreport = sumFinaldek;
                        $scope.DecksLables = labelsFinalCat;
                        $scope.DecksData = LogCountdata;
                        /* END : deck progress data */

                        /* word details data */
                        /* START : Total  */
                        var wordCount = [];
                        _.map(response.data.words, function (o) {
                            wordCount.push(o.word_count);
                        });
                        var month_list = moment.monthsShort();
                        var totaldatas = []
                        _.each(month_list, function (month_list) {
                            var countMonthword = 0;
                            _.each(response.data.words, function (word) {
                                if (month_list === moment(word.create_date).format("MMM")) {
                                    countMonthword = countMonthword + word.word_count;
                                }
                            });
                            totaldatas.push(countMonthword);
                        });
                        $scope.totallabels = month_list;
                        $scope.totalseries = ['Word'];
                        $scope.totaldata = totaldatas;
                        $scope.totaldatareport = _.sum(totaldatas);
                        /* End Total  */

                        /* START : Last week */
                        var StartDate = moment().clone().startOf('week').toISOString();
                        var days = 7;

                        var week_days = [];
                        var week_date = [];
                        for (var i = 0; i < days; i++) {
                            week_date.push(moment(StartDate).add(i, 'days').format("YYYY-MM-DD"));
                            week_days.push(moment(StartDate).add(i, 'days').format("dddd"));
                        }
                        var weekdata = [];
                        _.each(week_date, function (week_date) {
                            var countword = 0;
                            _.each(response.data.words, function (word) {
                                if (week_date === moment(word.create_date).format("YYYY-MM-DD")) {
                                    countword = countword + word.word_count;
                                }
                            });
                            weekdata.push(countword);
                        });
                        $scope.currentweeklabels = week_days;
                        $scope.currentweekseries = ['Word'];
                        $scope.currentweekdata = weekdata;
                        $scope.weekdatareport = _.sum(weekdata);
                        /* END : Last week */

                        /* Start Last Month */
                        var previousMonth = new Date();
                        /* Previous Month data fetch */
                        /*previousMonth.setMonth(previousMonth.getMonth() - 1); */
                        previousMonth.setMonth(previousMonth.getMonth());
                        var days = moment(previousMonth).daysInMonth();
                        /* Previous Month start date fetch */
                        /*var sdtartmonthdate = moment().add(-1, 'month').startOf('month')._d;*/
                        var sdtartmonthdate = moment().clone().startOf('month').toISOString();

                        var month_days = [];
                        var month_date = [];
                        for (var i = 0; i < days; i++) {
                            month_date.push(moment(sdtartmonthdate).add(i, 'day').format("YYYY-MM-DD"));
                            month_days.push(moment(sdtartmonthdate).add(i, 'day').format("dddd"));
                        }
                        var monthdata = [];
                        _.each(month_date, function (month_date) {
                            var countwordmonth = 0;
                            _.each(response.data.words, function (word) {
                                if (month_date === moment(word.create_date).format("YYYY-MM-DD")) {
                                    countwordmonth = countwordmonth + word.word_count;
                                }
                            });
                            monthdata.push(countwordmonth);
                        });
                        $scope.currentmonthlabels = month_date;
                        $scope.currentmonthseries = ['Word'];
                        $scope.currentmonthdata = monthdata;
                        $scope.monthdatareport = _.sum(monthdata);
                        /* END : Total Month */

                        /* Start : Total Minute data */
                        var totaldatasmunite = []
                        _.each(month_list, function (month_list) {
                            var countMonthmunite = 0;
                            _.each(response.data.study_data, function (word) {
                                if (month_list === moment(word.create_date).format("MMM")) {
                                    countMonthmunite = countMonthmunite + word.minutes;
                                }
                            });
                            totaldatasmunite.push(countMonthmunite);
                        });
                        $scope.totalmunitedata = totaldatasmunite;
                        $scope.totalmunitelabels = month_list;
                        $scope.totalmuniteseries = ['Munite'];
                        $scope.totalreportmunitedata = _.sum(totaldatasmunite);
                        /* END : Total Minute data */
                        /* Start : Week Minute data */
                        var weekmunitedata = [];
                        _.each(week_date, function (week_date) {
                            var countmunite = 0;
                            _.each(response.data.study_data, function (word) {
                                if (week_date === moment(word.create_date).format("YYYY-MM-DD")) {
                                    countmunite = countmunite + word.minutes;
                                }
                            });
                            weekmunitedata.push(countmunite);
                        });
                        $scope.currentweekmunitedata = weekmunitedata;
                        $scope.currentweekmunitelabels = week_days;
                        $scope.currentweekmuniteseries = ['Munite'];
                        $scope.weekmunitedatareport = _.sum(weekmunitedata);
                        /* END : Week Minute data */
                        /* Start : Month Minute data */
                        var monthminutedata = [];
                        _.each(month_date, function (month_date) {
                            var countminutes = 0;
                            _.each(response.data.study_data, function (word) {
                                if (month_date === moment(word.create_date).format("YYYY-MM-DD")) {
                                    countminutes = countminutes + word.minutes;
                                }
                            });
                            monthminutedata.push(countminutes);
                        });
                        $scope.currentmonthminutelabels = month_date;
                        $scope.currentmonthminuteseries = ['Minute'];
                        $scope.currentmonthminutedata = monthminutedata;
                        $scope.monthminutedatareport = _.sum(monthminutedata);
                        /* END : Total Month */
                    }
                }
            });
        };
        loadChart();
        /*Deaily report chart color and oprion*/
        $scope.doughnut = [];
        $scope.doughnut.options = {
            responsive: true,
            maintainAspectRatio: false,
            width: 100,
            height: 100
        };
        /*$scope.doughnut.colors = [ '#ccc', '#f44336', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];*/
        /*deck Pie  chart color and oprion*/
        $scope.pieChart = [];
        $scope.pieChart.options = {
            responsive: true,
            maintainAspectRatio: false,
            width: 100,
            height: 100
        };
        /*$scope.pieChart.colors = [ '#ccc', '#f44336', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];*/

        $scope.goToPage = function (page) {
            window.location.href = '/#/' + page;
        };

    });
