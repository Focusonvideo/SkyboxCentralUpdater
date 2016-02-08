/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('TeamCtrl', ['$scope', 'icSOAPServices', '$location',  function($scope, icSOAPServices, $location) {
        $scope.showSpinner = true;
//        $scope.modTeamData = {};
        icSOAPServices.icGet("Team_GetList").then(
            function(data){
                $scope.showSpinner = false;
                $scope.TeamData = data;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        $scope.ModTeam = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/teammod");
        };
        $scope.AddTeam = function(){
            $location.path("/teamadd");
        };
    }]);