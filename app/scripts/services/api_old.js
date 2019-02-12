'use strict';

/**
 * @ngdoc service
 * @name vdateApp.api
 * @description
 * # api
 * Factory in the vdateApp.
 */
angular.module('vdateApp')
        .factory('api', function (ApiEndpoint, $http, $q, blockUI) {
            var call = function (config)
            {
                blockUI.start();
                //console.log("APIService");
                var deffered = $q.defer();
                if (config.method === 'GET' || config.method === 'DELETE') {
                    $http({
                        url: config.url,
                        dataType: "json",
                        method: config.method,
                        headers: {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache"
                        }
                    }).then(function (response) {
                        //console.log(response);
                        deffered.resolve(response.data);
                        blockUI.stop();
                    }, function (error) {
                        console.log(error);
                        deffered.resolve(error);
                        blockUI.stop();
                    });
                } else {
                    var deffered = $q.defer();
                    $http({
                        url: config.url,
                        dataType: "json",
                        method: config.method,
                        data: config.data,
                        headers: {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache"
                        }
                    }).then(function (response) {
                        //console.log(response);
                        deffered.resolve(response);
                        blockUI.stop();
                    },function (response) {
                        console.log(response);
                        deffered.resolve(response);
                        blockUI.stop();
                    });
                    return deffered.promise;
                }

                return deffered.promise;
            };

            var get = function (url) {
                var config = {url: url, method: ApiEndpoint.Methods.GET};
                return this.call(config);
            }

            var del = function (url) {
                var config = {url: url, method: ApiEndpoint.Methods.DELETE};
                return this.call(config);
            }

            var post = function (url, data) {

                var config = {url: url, method: ApiEndpoint.Methods.POST, data: data};
                return this.call(config);
            }

            var put = function (url, data) {
                var config = {url: url, method: ApiEndpoint.Methods.PUT, data: data};
                return this.call(config);
            }

            return {call: call, get: get, post: post, del: del, put: put};
        });
