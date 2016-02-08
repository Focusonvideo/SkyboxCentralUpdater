/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('OutstateCtrl', ['$scope', 'icSOAPServices', '$location',  function($scope, icSOAPServices, $location) {
        $scope.showSpinner = true;
        icSOAPServices.icGet("Outstate_GetList").then(
            function(data){
                $scope.showSpinner = false;
                $scope.OutstateData = data;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        $scope.ModOutstate = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/outstatemod");
        };
        $scope.AddOutstate = function(){
            $location.path("/outstateadd");
        };
    }]);