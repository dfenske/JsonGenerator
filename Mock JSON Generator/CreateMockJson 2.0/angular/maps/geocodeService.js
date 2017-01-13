//geocodeService.js
(function () {
    'use strict';

    // create the controller and inject Angular's $scope
    angular.module('webApp')
    .factory('Geocode', function ($http) {

        // takes an address input as a string
        // Example: '1600 Amphitheatre Parkway Mountain View CA'
        var geocode = function (address) {

            // replace spaces with '+'
            address = address.replace(/ /g, '+');

            return $http({
                method: 'GET',

                // Hit the Geocode API with address, return JSON
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address
            })
            .then(function (res) {
                // Converts a google geocode result into an address model we can use
                var convertResultToModel = function (googleResult) {
                    var dict = {};
                    angular.forEach(googleResult.data.results[0].address_components, function (obj, key) {
                        dict[obj.types[0]] = obj.short_name;
                    });
                    var adr = dict.street_number ? dict.street_number : '';
                    var st = dict.route ? dict.route : '';
                    var city = dict.locality ? dict.locality : '';
                    var state = dict.administrative_area_level_1 ? dict.administrative_area_level_1 : '';
                    var zip = dict.postal_code ? dict.postal_code : '';
                    var latitude = googleResult.data.results[0].geometry.location.lat;
                    var longitude = googleResult.data.results[0].geometry.location.lng;
                    return {
                        address: adr + " " + st,
                        city: city + ", " + state,
                        zipCode: zip,
                        lat: latitude,
                        long: longitude
                    }
                };

                // Call the convert model function
                var addressModel = convertResultToModel(res);

                return {
                    // format the object the way that $scope.map expects it
                    map: {
                        center: {
                            latitude: addressModel.lat,
                            longitude: addressModel.long
                        },
                        zoom: 16
                    },

                    // format the object the way that $scope.marker expects it
                    marker: {
                        id: 0,
                        coords: {
                            latitude: addressModel.lat,
                            longitude: addressModel.long
                        }
                    },
                    addressData: addressModel
                };
            });
        };

        // make this function available when factory is included as dependency
        return {
            geocode: geocode
        };
    })
})();
