(function () {
    'use strict';

    var tabletApp = angular.module('webApp');

    tabletApp.directive('taHierarchy', function () {
        return {
            restrict: 'EA',
            scope: false,
            controller: 'hierarchyController',
            templateUrl: function (elem, attr) {
                return 'views/partials/hierarchy.html';
            }
        }
    });
})();