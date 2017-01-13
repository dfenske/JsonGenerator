//modalInstanceController.js
(function () {
    'use strict';

    angular.module('webApp')
        .controller('modalInstanceController', ['$uibModalInstance', '$scope', '$localStorage', '$location', '$route', 'hierarchyService', function ($uibModalInstance, $scope, $localStorage, $location, $route, hierarchyService) {
            $scope.ok = function () {
                ClearLocalStorage();
                $uibModalInstance.close();
                $location.path('components');
                $route.reload();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };

            var ClearLocalStorage = function () {
                $localStorage.$reset();
                $localStorage.hierarchyObj = null;
                hierarchyService.SetHierarchyObj([]);
                $scope.data = null;
                $scope.dataExists = false;
                // TEMPORARY FOR DEBUGGING:
                $scope.hierarchy = [];
            }
        }]);
})();