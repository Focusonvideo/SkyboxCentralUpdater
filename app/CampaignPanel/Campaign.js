/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('CampaignCtrl', ['$scope', 'icSOAPServices', '$location' ,function($scope, icSOAPServices, $location) {
    $scope.showSpinner = true;
    icSOAPServices.icGet("Campaign_GetList").then(
        function(data){
            $scope.showSpinner = false;
            $scope.CampaignData = data;
        },
        function(response){
            $scope.showSpinner = false;
            alert("BAD:" + JSON.stringify(response));
        }
    );
        $scope.ModCampaign = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/campaignmod");
        };
        $scope.AddCampaign = function(idxData){
            SOAPClient.passData = {};
            $location.path("/campaignadd");
        }
}]);