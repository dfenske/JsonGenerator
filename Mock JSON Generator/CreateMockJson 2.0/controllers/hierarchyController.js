//hierarchyController.js
(function () {
    'use strict';

    angular.module('webApp')
        .controller('hierarchyController', ['$scope', '$rootScope', '$localStorage', '$uibModal', '$document', 'hierarchyService', 'jsonService',
            function ($scope, $rootScope, $localStorage, $uibModal, $document, hierarchyService, jsonService) {

            /** DATA **/
            $scope.data = null;
            $scope.dataExists = false;

            /** LOCAL STORAGE **/
            $scope.$watch('$viewContentLoaded', function () {
                LoadFromLocalStorage();
            });

            $rootScope.$on('hierarchy-updated', function (event, data) {
                SaveToLocalStorage();
                // Create tree from hierarchy
                $scope.data = hierarchyService.CreateTreeFromHierarchy();
                $scope.dataExists = ($scope.data != null && $scope.data.length > 0);
                // TEMPORARY FOR DEBUGGING:
                $scope.hierarchy = hierarchyService.GetHierarchyObj();
            });

            $scope.PopUpModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/partials/modal.html',
                    controller: 'modalInstanceController',
                    size: 'sm',
                    appendTo: angular.element($document[0].querySelector('body'))
                });
            };

            var SaveToLocalStorage = function () {
                $localStorage.hierarchyObj = hierarchyService.GetHierarchyObj();
            }

            var LoadFromLocalStorage = function () {
                hierarchyService.SetHierarchyObj($localStorage.hierarchyObj);

                $scope.data = hierarchyService.CreateTreeFromHierarchy();
                $scope.dataExists = ($scope.data != null && $scope.data.length > 0);
                if ($localStorage.hierarchyObj != null) {
                    $rootScope.$broadcast('hierarchy-updated'); // must call this so that dropdowns get repopulated.
                }
                // TEMPORARY FOR DEBUGGING:
                $scope.hierarchy = hierarchyService.GetHierarchyObj();
            }

            /** FUNCTIONALITY **/
            $scope.select = function (data) {
                $rootScope.$broadcast('item-selected', data);
            };

            $scope.collapseAll = function () {
                $scope.$broadcast('angular-ui-tree:collapse-all');
            };

            $scope.expandAll = function () {
                $scope.$broadcast('angular-ui-tree:expand-all');
            };

            /** JSON GENERATION **/
            $scope.GenerateAndDownload = function () {
                // Create the JSON structure from the HierarchyObj.
                var json = jsonService.CreateJSON(hierarchyService.GetHierarchyObj());

                // Append the static fields at the end.
                //var json = jsonService.AppendStaticData();
                var blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json;charset=utf-8;" }); // THIS DOESN'T WORK IN IE 11
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'mock.json');
                downloadLink[0].click();
            };

        }]);
})();
