/**
 * Created by Chester on 3/20/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillPostContactCtrl', ['$scope', 'icSOAPServices', '$location', '$filter' ,function($scope, icSOAPServices, $location, $filter) {
        var orderBy = $filter('orderBy');
        $scope.showSpinner = true;
        icSOAPServices.icGet("Skill_GetList").then(
            function(data){
                var orderedlist = orderBy(data,"SkillName",false);
                $scope.Skills = orderedlist;
                for (var x =0;x<data.length;x++){
                    $scope.Skills[x].index = x;
                    if ($scope.Skills[x].UseDispositions == true){
                        $scope.Skills[x].AWUorDisp = "Disp";
                    }
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
 /*       $scope.ModSkill = function(idxData){
            SOAPClient.passData = idxData;
            $location.path("/skillMod");
        };
        $scope.AddSkill = function(idxData){
            SOAPClient.passData = {};
            $location.path("/skillAdd");
        }
        $scope.AddBRDSkill = function(idxData){
            $location.path("/skillBRDAdd");
        } */

    }]);