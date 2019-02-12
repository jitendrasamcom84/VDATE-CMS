'use strict';

/**
 * @ngdoc overview
 * @name vdateApp
 * @description
 * # vdateApp
 *
 * Main module of the application.
 */
angular
    .module('vdateApp', [
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'app.main',
        'app.navigation',
        'app.localize',
        'app.activity',
        'app.smartui',
        'datatables',
        'lodash',
        'xeditable',
        'ngFileUpload',
        'ngDropzone',
        'ui.sortable',
        'ngBootstrap',
        //"pascalprecht.translate",
        "blockUI",
        "vsGoogleAutocomplete",
        "colorpicker.module",
        "ui.select2",
        //"textAngular",
        "ui.bootstrap.datetimepicker",
        "ui.select",
        "chart.js",
        "moment-picker",
        "ng.ckeditor"
    ])

    .config(function ($routeProvider, $httpProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/member/add', {
                templateUrl: 'views/add_member.html',
                controller: 'ManageMemberCtrl',
                controllerAs: 'manageMember'
            })
            .when('/member', {
                templateUrl: 'views/member_list.html',
                controller: 'ManageMemberCtrl',
                controllerAs: 'manageMember'
            })
            .when('/member/Edit/:id', {
                templateUrl: 'views/add_member.html',
                controller: 'ManageMemberCtrl',
                controllerAs: 'manageMember'
            })
            .when('/member/View/:id', {
                templateUrl: 'views/view_member_list.html',
                controller: 'ManageMemberCtrl',
                controllerAs: 'manageMember'
            })
            .when('/packages/add', {
                templateUrl: 'views/add_packages.html',
                controller: 'ManagePackagesCtrl',
                controllerAs: 'managePackages'
            })
            .when('/packages', {
                templateUrl: 'views/packages_list.html',
                controller: 'ManagePackagesCtrl',
                controllerAs: 'managePackages'
            })
            .when('/packages/Edit/:id', {
                templateUrl: 'views/add_packages.html',
                controller: 'ManagePackagesCtrl',
                controllerAs: 'managePackages'
            })
            .when('/package/View/:id', {
                templateUrl: 'views/view_package_list.html',
                controller: 'ManagePackagesCtrl',
                controllerAs: 'managePackages'
            })
            .when('/videos/add', {
                templateUrl: 'views/add_videos.html',
                controller: 'ManageVideosCtrl',
                controllerAs: 'manageVideos'
            })
            .when('/videos', {
                templateUrl: 'views/videos_list.html',
                controller: 'ManageVideosCtrl',
                controllerAs: 'manageVideos'
            })
            .when('/video_notification', {
                templateUrl: 'views/video_notification.html',
                controller: 'ManageVideosCtrl',
                controllerAs: 'manageVideos'
            })
            .when('/videos/Edit/:id', {
                templateUrl: 'views/add_videos.html',
                controller: 'ManageVideosCtrl',
                controllerAs: 'manageVideos'
            })
            .when('/subcategory/add/:id', {
                templateUrl: 'views/add_subcategory.html',
                controller: 'SubCatCtrl',
                controllerAs: 'manageQuestions'
            })
            .when('/questions', {
                templateUrl: 'views/questions_list.html',
                controller: 'ManageQuestionsCtrl',
                controllerAs: 'manageQuestions'
            })
            .when('/subcategory/Edit/:id', {
                templateUrl: 'views/add_subcategory.html',
                controller: 'SubCatCtrl',
                controllerAs: 'manageQuestions'
            })
            .when('/responses/add/:id', {
                templateUrl: 'views/add_responses.html',
                controller: 'ManageResponsesCtrl',
                controllerAs: 'manageResponses'
            })
            .when('/responses/:id', {
                templateUrl: 'views/responses_list.html',
                controller: 'ManageResponsesCtrl',
                controllerAs: 'manageResponses'
            })
            .when('/responses/Edit/:id', {
                templateUrl: 'views/add_responses.html',
                controller: 'ManageResponsesCtrl',
                controllerAs: 'manageResponses'
            })
            .when('/events/add', {
                templateUrl: 'views/add_events.html',
                controller: 'ManageEventsCtrl',
                controllerAs: 'manageEvents'
            })
            .when('/events', {
                templateUrl: 'views/events_list.html',
                controller: 'ManageEventsCtrl',
                controllerAs: 'manageEvents'
            })
            .when('/events/Edit/:id', {
                templateUrl: 'views/add_events.html',
                controller: 'ManageEventsCtrl',
                controllerAs: 'manageEvents'
            })
            .when('/ques_cat/add', {
                templateUrl: 'views/add_ques_cat.html',
                controller: 'ManageQuestCatCtrl',
                controllerAs: 'manageQuesCat'
            })
            .when('/ques_cat', {
                templateUrl: 'views/ques_cat_list.html',
                controller: 'ManageQuestCatCtrl',
                controllerAs: 'manageQuesCat'
            })
            .when('/ques_cat/Edit/:id', {
                templateUrl: 'views/add_ques_cat.html',
                controller: 'ManageQuestCatCtrl',
                controllerAs: 'manageQuesCat'
            })
            .when('/contactus', {
                templateUrl: 'views/contactus_list.html',
                controller: 'ManageContactUSCtrl',
                controllerAs: 'manageContactUS'
            })
            .when('/contactus_headline', {
                templateUrl: 'views/headline_list.html',
                controller: 'ManageHeadlineCtrl',
                controllerAs: 'manageHeadline'
            })
            .when('/add_headline', {
                templateUrl: 'views/add_headline.html',
                controller: 'ManageHeadlineCtrl',
                controllerAs: 'manageHeadline'
            })
            .when('/headline/Edit/:id', {
                templateUrl: 'views/add_headline.html',
                controller: 'ManageHeadlineCtrl',
                controllerAs: 'manageHeadline'
            })
            .when('/checkouts', {
                templateUrl: 'views/checkouts_list.html',
                controller: 'ManageCheckOutsCtrl',
                controllerAs: 'manageCheckOuts'
            })
            .when('/threads/add', {
                templateUrl: 'views/add_threads.html',
                controller: 'ManageThreadsCtrl',
                controllerAs: 'manageThreads'
            })
            .when('/threads', {
                templateUrl: 'views/threads_list.html',
                controller: 'ManageThreadsCtrl',
                controllerAs: 'manageThreads'
            })
            .when('/threads/Edit/:id', {
                templateUrl: 'views/add_threads.html',
                controller: 'ManageThreadsCtrl',
                controllerAs: 'manageThreads'
            })
            .when('/posts/add', {
                templateUrl: 'views/add_posts.html',
                controller: 'ManagePostsCtrl',
                controllerAs: 'managePosts'
            })
            .when('/posts', {
                templateUrl: 'views/posts_list.html',
                controller: 'ManagePostsCtrl',
                controllerAs: 'managePosts'
            })
            .when('/posts/Edit/:id', {
                templateUrl: 'views/add_posts.html',
                controller: 'ManagePostsCtrl',
                controllerAs: 'managePosts'
            })
            .when('/aboutus', {
                templateUrl: 'views/add_aboutus.html',
                controller: 'AboutUSCtrl',
                controllerAs: 'aboutUS'
            })
            .when('/terms&condition', {
                templateUrl: 'views/add_terms&condition.html',
                controller: 'Terms&ConditionCtrl',
                controllerAs: 'terms&condition'
            })
            .when('/order', {
                templateUrl: 'views/order_list.html',
                controller: 'OrderCtrl',
                controllerAs: 'manageOrder'
            })
            .when('/order/add', {
                templateUrl: 'views/add_order.html',
                controller: 'OrderCtrl',
                controllerAs: 'manageOrder'
            })
            .when('/order/Edit/:id', {
                templateUrl: 'views/add_order.html',
                controller: 'OrderCtrl',
                controllerAs: 'manageOrder'
            })
            .when('/coupon', {
                templateUrl: 'views/coupon_list.html',
                controller: 'CouponCtrl',
                controllerAs: 'manageCoupon'
            })
            .when('/coupon/add', {
                templateUrl: 'views/add_coupon.html',
                controller: 'CouponCtrl',
                controllerAs: 'manageCoupon'
            })
            .when('/coupon/Edit/:id', {
                templateUrl: 'views/add_coupon.html',
                controller: 'CouponCtrl',
                controllerAs: 'manageCoupon'
            })
            .when('/forum_list/add', {
                templateUrl: 'views/add_forum.html',
                controller: 'ForumCtrl',
                controllerAs: 'manageCoupon'
            })
            .when('/forum_list/Edit/:id', {
                templateUrl: 'views/add_forum.html',
                controller: 'ForumCtrl',
                controllerAs: 'manageCoupon'
            })
            .when('/forum_list', {
                templateUrl: 'views/forum_list.html',
                controller: 'ForumCtrl',
                controllerAs: 'manageCoupon'
            })
            .when('/message_list/:id', {
                templateUrl: 'views/message.html',
                controller: 'MessageCtrl',
                controllerAs: 'message'
            })
            .when('/waiting_forum_list', {
                templateUrl: 'views/waiting_forum_list.html',
                controller: 'ForumCtrl',
                controllerAs: 'manageCoupon'
            })
            .when('/admin_list', {
                templateUrl: 'views/admin_list.html',
                controller: 'AdminCtrl',
                controllerAs: 'admin'
            })
            .when('/admin_list/add', {
                templateUrl: 'views/add_admin.html',
                controller: 'AdminCtrl',
                controllerAs: 'admin'
            })
            .when('/admin_list/Edit/:id', {
                templateUrl: 'views/add_admin.html',
                controller: 'AdminCtrl',
                controllerAs: 'admin'
            })
            .when('/que_ans/add', {
                templateUrl: 'views/add_que_ans.html',
                controller: 'QuesansCtrl',
                controllerAs: 'queans'
            })
            .when('/que_ans/Edit/:id', {
                templateUrl: 'views/add_que_ans.html',
                controller: 'QuesansCtrl',
                controllerAs: 'queans'
            })
            .when('/que_ans_list', {
                templateUrl: 'views/que_ans_list.html',
                controller: 'QuesansCtrl',
                controllerAs: 'queans'
            })
            .when('/help', {
                templateUrl: 'views/help.html',
                controller: 'HelpCtrl',
                controllerAs: 'help'
            })
            .when('/questionnaire', {
                templateUrl: 'views/questionnaire.html',
                controller: 'ManageQuestCatCtrl',
                controllerAs: 'questionnaire'
            })
            .when('/question_queue/:id', {
                templateUrl: 'views/question_queue.html',
                controller: 'QuestionQueueCtrl',
                controllerAs: 'questionnaire'
            })
            .when('/add_question_queue/add/:id', {
                templateUrl: 'views/add_question_queue.html',
                controller: 'QuestionQueueCtrl',
                controllerAs: 'questionnaire'
            })
            .when('/add_question_queue/Edit/:id', {
                templateUrl: 'views/add_question_queue.html',
                controller: 'QuestionQueueCtrl',
                controllerAs: 'questionnaire'
            })
            .when('/push', {
                templateUrl: 'views/push.html',
                controller: 'PushCtrl',
                controllerAs: 'push'
            })
            .when('/push/add', {
                templateUrl: 'views/push_details.html',
                controller: 'PushCtrl',
                controllerAs: 'pushDetails'
            })
            .when('/reset_password/:id', {
                templateUrl: 'views/resetpassword.html',
                controller: 'ResetPasswordCtrl',
                controllerAs: 'resetpassword'
            })
            .when('/header_content', {
                templateUrl: 'views/add_header_content.html',
                controller: 'ContentCtrl',
                controllerAs: 'content'
            })
            .when('/footer_content', {
                templateUrl: 'views/add_footer_content.html',
                controller: 'ContentCtrl',
                controllerAs: 'content'
            })
            .when('/package_header', {
                templateUrl: 'views/add_package_header.html',
                controller: 'PackageHeaderCtrl',
                controllerAs: 'packageheader'
            })
            .when('/login', {
                templateUrl: 'login.html'
            })
            .otherwise({
                controller: function () {
                    window.location = 'login.html';
                },
                template: "<div></div>"
            });
        $locationProvider.hashPrefix('');


        $httpProvider.interceptors.push(function ($q, $rootScope) {
            return {
                'request': function (config) {
                    if ($rootScope.globals && $rootScope.globals.currentUser) {
                        return config;
                    }
                    return config;

                }
            };
        });

    })
    .filter('map', function () {
        return function (input, propName) {
            return input.map(function (item) {
                return item[propName];
            });
        };
    })
    .config(["$routeProvider", "blockUIConfig", function ($routeProvider, blockUIConfig) {

        blockUIConfig.autoBlock = false;
    }])
    .run(['$rootScope', '$location', '$cookieStore', '$http', 'editableOptions', '$filter', '$timeout', '$templateCache', function ($rootScope, $location, $cookieStore, $http, editableOptions, $filter, $timeout, $templateCache) {

        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $http.get('../views/error-list.html')
            .then(function (response) {
                $templateCache.put('error-list.html', response.data);
            });

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if (window.location.href.indexOf('login.html') === -1 && window.location.href.indexOf('forgot_password.html') === -1 && !$rootScope.globals.currentUser) {
                $timeout(function () {
                    window.location = '/login.html';
                }, 1000, false);
                event.preventDefault();
            } else {
                if ($rootScope.globals.currentUser) {
                    var role = $rootScope.globals.currentUser.role;
                }
            }
        });
    }])
    .service('alertService', function () {
        var alert = {
        };
        alert.success = function (title, content) {
            $.smallBox({
                title: title,
                content: "<i class='fa fa-clock-o'></i> <i>" + content + "</i>",
                color: "#739e73",
                iconSmall: "fa fa-thumbs-up fa-2x fadeInRight animated",
                timeout: 4000
            });
        };
        alert.error = function (content) {
            $.smallBox({
                title: "Opps...",
                content: "<i class='fa fa-clock-o'></i> <i>" + content + "</i>",
                color: "#C46A69",
                iconSmall: "fa fa-thumbs-down fa-2x fadeInRight animated",
                timeout: 4000
            });
        };
        return alert;
    })
    .filter('trusted', ['$sce', function ($sce) {
        var div = document.createElement('div');
        return function (text) {
            div.innerHTML = text;
            return $sce.trustAsHtml(text);
        };
    }])
    ;
