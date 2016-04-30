/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('AgentCtrl', ['$scope', 'icSOAPServices', '$location', '$filter' , function($scope, icSOAPServices, $location, $filter) {
        var orderBy = $filter('orderBy');
        $scope.showSpinner = true;
//        $scope.modTeamData = {};
        icSOAPServices.icGet("Agent_GetList").then(
            function(data){
                $scope.showSpinner = false;
                var orderedlist = orderBy(data,"LastName",false);
                $scope.AgentsData = orderedlist;
                console.log($scope);
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        $scope.ModAgent = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/agentmod");
        };
        $scope.AddAgent = function(){
            $location.path("/agentadd");
        };
    }]);