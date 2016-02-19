/**
 * Created by Chester on 2/5/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillCtrl', ['$scope', 'icSOAPServices', '$location' ,function($scope, icSOAPServices, $location) {
        $scope.showSpinner = true;
        icSOAPServices.icGet("Skill_GetList").then(
            function(data){
                $scope.SkillData = data;
                for (var x =0;x<data.length;x++){
                    $scope.SkillData.index = x;
                }
                $scope.showSpinner = false;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        ;
        console.log($scope);
        $scope.ModSkill = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/skillMod");
        };
        $scope.AddSkill = function(idxData){
            SOAPClient.passData = {};
            $location.path("/skillAdd");
        }
    }]);