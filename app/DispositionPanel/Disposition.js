/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('DispositionCtrl', ['$scope', 'icSOAPServices', '$location',  function($scope, icSOAPServices, $location) {
        $scope.showSpinner = true;
//        $scope.modDispositionData = {};
        icSOAPServices.icGet("Disposition_GetList").then(
            function(data){
                $scope.showSpinner = false;
                $scope.DispositionData = data;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        $scope.ModDisposition = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/dispositionmod");
        };
        $scope.AddDisposition = function(){
            $location.path("/dispositionadd");
        };
    }]);