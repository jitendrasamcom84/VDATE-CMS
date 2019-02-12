'use strict';
/**
 * @ngdoc service
 * @name vdateApp.ApiEndpoint
 * @description
 * # ApiEndpoint
 * Constant in the vdateApp.
 */
angular.module('vdateApp')
    .constant('ApiEndpoint', {
        // BaseUrl: 'http://localhost:9090/api/',
        // ServerUrl: 'http://localhost:9090/',
        //ServerUrl: 'http://192.168.1.118:9090/',
        //BaseUrl: 'http://192.168.1.118:9090/api/',
        VimeoUrl :'https://api.vimeo.com/me',
        
        /*ServerUrl: 'http://109.237.25.22:3065/',
        BaseUrl: 'http://109.237.25.22:3065/api/',*/

        ServerUrl: 'http://207.148.27.156:3065/',//samcom new server
        BaseUrl: 'http://207.148.27.156:3065/api/',

        Methods: { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE' },
        Models: {
            USER: 'Members',
            PACKAGES: 'Packages',
            VIDEOS: 'Videos',
            QUESTIONS: 'Questions_att',
            RESPONSES: 'Responses_att',
            EVENTS: 'Events',
            APPFRIENDS: 'AppFriends',
            MEMBERSHIP: 'Membership',
            FAVORITES: 'Favorites',
            BLOCKEDUSERS: 'BlockedUsers',
            QUES_CAT: 'Ques_Cat',
            CONTACTUS: 'ContactUS',
            THREADS: 'Threads',
            POSTS: 'Posts',
            CHECKOUTS: 'CheckOuts',
            ABOUTUS: 'Aboutus',
            TERMSCONDITION: 'TermsCondition',
            NOTIFICATION: 'Notifications',
            ORDER: 'Order',
            COUPON: 'Coupon',
            HELP: 'Help',
            FAQ: 'Faq',
            SUBCATEGORY: 'Subcategory',
            FILTER: 'notifications/filterusernoti',
            BLOCKED: 'appfriends/addtoblocked',
            NOTIFICATIONS: 'notifications/sendmessages',
            SUBCATDELETE: 'questions/subcatedelete',
            QUESTIONDELETE: 'questions/questiondelete',
            HEADLINE : 'Headline',
            VIDEO_APPROVE : 'image/approvevideo',
            CONTENT : 'Content',
            PACKAGE_HEADER : 'PackageHeader'
        },
        URLS: {
            QUERY: 'query/',
            BULK: 'bulk/insert/',
            USER_VERIFY: 'users/welcome_user',
            CONDITIONS: 'execute/conditions/',
            FORGOT_PASSWORD: 'users/forgotpassword',
            UPDATE_PASSWORD: 'users/updatePassword',
            PUT_POST: 'query/execute/putpost/',

            CHANGE_PASSWORD: 'users/updatepassword',
            USER_REGISTER: "users/register/local",
            USER_UPDATE: 'users/updateUserProfile',
        },
        getUrl: function (url) {
            return this.BaseUrl + url;
        },
        image: function (img_name) {
            return this.getUrl('image/get/' + img_name);
        },
        getImage: function (image_name, type) {
            if (image_name) {
                return this.BaseUrl + 'image/get/' + image_name;
            } else {
                switch (type) {
                    case 'user':
                        return "img/avatars/male.png";
                        break;
                    default:
                        return "../img/placeholder.png";
                }
            }
        }
    });
