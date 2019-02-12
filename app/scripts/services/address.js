/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('vdateApp')
        .service('AddressService', function (ApiService,ApiEndpoint) {
            var services = {};
    
            services.loadCountries = function(callback){
                 ApiService.getModel(ApiEndpoint.Models.COUNTRY).then(function (response) {
                    if (response.is_error) {
                        callback(response.message, null);
                    } else {
                        callback(null,response.data);
                    }
                });
            };
            
            services.loadStates = function(country, callback) {
                var cond = {
                    where: {country: country}
                };
                ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.STATE, cond).then(function (response) {
                    if (response.is_error) {
                        callback(response.message, null);
                    } else {
                        if (response.data.length > 0) {
                            callback(null, response.data);
                        } else {
                            callback(null, []);
                        }
                    }
                });
            };
            
            services.loadCities = function(state, callback){
                var cond = {
                    where: {state: state}
                };
                ApiService.getModelViaPost(ApiEndpoint.URLS.CONDITIONS + ApiEndpoint.Models.CITY, cond).then(function (response) {
                    if (response.is_error) {
                        callback(response.message, null);
                    } else {
                        if (response.data.length > 0) {
                            callback(null, response.data);
                        } else {
                            callback(null, []);
                        }
                    }
                });
            };
    
            return services;
        });