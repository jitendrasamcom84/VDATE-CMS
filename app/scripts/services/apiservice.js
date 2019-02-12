'use strict';

/**
 * @ngdoc service
 * @name vdateApp.ApiService
 * @description
 * # ApiService
 * Factory in the vdateApp.
 */
angular.module('vdateApp')
        .factory('ApiService', function (api, ApiEndpoint) {

            var getModel = function (url_part)
            {
                var url = ApiEndpoint.getUrl(ApiEndpoint.URLS.QUERY) + url_part;
                return api.get(url);
            };
            
            var getModelById = function (url_part, id)
            {
                var url = ApiEndpoint.getUrl(ApiEndpoint.URLS.QUERY) + url_part + '/' + id;
                return api.get(url);
            };
            
             var getModelViaPost = function (url_part, data)
            {
                var url = ApiEndpoint.getUrl(ApiEndpoint.URLS.QUERY) + url_part;                
                return api.post(url, data);
            };
            
            var postModel = function(model_name, data) {
                var url = ApiEndpoint.getUrl(ApiEndpoint.URLS.QUERY) + model_name;
                return api.post(url, data);
            }
            var postModelWQ = function(model_name, data) {
                var url = ApiEndpoint.getUrl('') + model_name;
                return api.post(url, data);
            }
            
            var putModel = function(model_name, data) {
                var url = ApiEndpoint.getUrl(ApiEndpoint.URLS.QUERY) + model_name;
                return api.put(url, data);
            }
            
            var deleteModel = function(model_name, id) {
                var url = ApiEndpoint.getUrl(ApiEndpoint.URLS.QUERY) + model_name + '/' + id;
                return api.del(url);
            }
            
            var softDeleteModel = function(model_name, id) {
                var url = ApiEndpoint.getUrl(ApiEndpoint.URLS.QUERY) + 'soft/' +model_name + '/' + id;
                return api.del(url);
            }

            return {
                getModel: getModel,
                getModelById: getModelById,
                postModel : postModel,
                putModel : putModel,
                deleteModel : deleteModel,
                softDeleteModel:softDeleteModel,
                getModelViaPost : getModelViaPost,
                postModelWQ:postModelWQ
            };

        });
