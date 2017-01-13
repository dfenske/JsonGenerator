// mainModule.js
(function () {
    'use strict';

    angular.module('webApp', ['ngRoute', 'ngStorage', 'uiGmapgoogle-maps', 'ui.bootstrap', 'ngToast', 'ngAnimate', 'ui.tree', 'ngMessages'])
    .config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyB1ep3XsibDrzvg2cJLwn-k2ZGA9GuDCKs',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    });
})();