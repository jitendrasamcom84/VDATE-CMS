'use strict';

/**
 * @ngdoc service
 * @name vdateApp.services
 * @description
 * # services
 * Service in the vdateApp.
 */
angular.module('vdateApp')
    .service('scrollService', function () {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis: 'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        }

        return ss;
    })
    .service('growlService', function () {
        var gs = {};
        gs.growl = function (message, type) {
            $.growl({
                message: message
            }, {
                    type: type,
                    allow_dismiss: false,
                    label: 'Cancel',
                    className: 'btn-xs btn-inverse',
                    placement: {
                        from: 'top',
                        align: 'right'
                    },
                    delay: 2500,
                    animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                    },
                    offset: {
                        x: 20,
                        y: 85
                    }
                });
        }

        return gs;
    })

    .factory('socket', function ($rootScope, ApiEndpoint) {
        var socket = io.connect(ApiEndpoint.ServerUrl);
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    console.log("eventName" , eventName)
                    var args = arguments;
                    $rootScope.$apply(function () {
                        console.log("socket on")
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    console.log("emit" , eventName)
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            console.log("socket emit")
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    })

    ;