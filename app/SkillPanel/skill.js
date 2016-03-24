/**
 * Created by Chester on 2/5/16. ok
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillCtrl', ['$scope', 'icSOAPServices', '$location', '$filter' ,function($scope, icSOAPServices, $location, $filter) {
        var orderBy = $filter('orderBy');
        $scope.showSpinner = true;

        icSOAPServices.icGet("Skill_GetList").then(
            function(data){
                var orderedlist;
                orderedlist = orderBy(data, "SkillName", false);
                $scope.SkillData = orderedlist;
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
        icSOAPServices.icGet("Script_GetList").then(
            function(data){
                var orderedscriptlist;
                orderedscriptlist = orderBy(data, "ScriptName", false);
                $scope.ScriptData = orderedscriptlist;
                $scope.showSpinner = false;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        console.log($scope);
        $scope.ModSkill = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/skillMod");
        };
        $scope.AddSkill = function(){
            SOAPClient.passData = {};
            $location.path("/skillAdd");
        };
        $scope.AddBRDSkill = function(){
            $location.path("/skillBRDAdd");
        };
        $scope.SkillPost = function(){
            $location.path("/skillPost");
        }

    }]);