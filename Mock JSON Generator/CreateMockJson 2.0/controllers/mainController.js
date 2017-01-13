//mainController.js
(function () {
    'use strict';

    angular.module('webApp')
        .controller('mainController', ['$scope', '$uibModal','$document', function ($scope, $uibModal, $document) {

            // The modal that asks if you are sure you want to overwrite
            $scope.NewFile = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/partials/modal.html',
                    controller: 'modalInstanceController',
                    size: 'sm',
                    appendTo: angular.element($document[0].querySelector('body'))
                });
            };
        }]);
})();
