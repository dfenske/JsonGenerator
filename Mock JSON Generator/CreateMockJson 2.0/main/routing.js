(function () {
    'use strict';

    angular.module('webApp')
    .config(function ($routeProvider) {
        $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'mainController'
        })

        .when('/help', {
            templateUrl: 'views/help.html',
            controller: 'mainController'
        })

        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'mainController'
        })

        .when('/components', {
            templateUrl: 'views/components.html',
            controller: 'componentController'
        })

        .when('/404', {
            templateUrl: 'views/404.html',
            controller: 'componentController'
        })

        .otherwise({ redirectTo: '/404' });
    });
})();