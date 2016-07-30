/**
 * Created by Chester on 2/5/16. ok
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillCtrl', ['$scope', 'icSOAPServices', '$location', '$filter' ,function($scope, icSOAPServices, $location, $filter) {
        var orderBy = $filter('orderBy');
        $scope.showSpinner = true;

        function parseBool(val) { return val === true || val === "True" }

        var token = SOAPClient.ICToken;
        var extURL = 'services/v7.0/skills';
        icSOAPServices.ICGET(token,extURL).then(
            function(data){
                var orderedlist;

//                alert(JSON.stringify(data));
                orderedlist = orderBy(data.data.resultSet.skills, "skillName", false);
                $scope.NewSkillData = orderedlist;
                for (var x =0;x<data.data.resultSet.skills.length;x++){
                    $scope.NewSkillData[x].index = x;
                    $scope.NewSkillData[x].agentless = parseBool($scope.NewSkillData[x].agentless);
                    $scope.NewSkillData[x].allowSecondaryDisposition = parseBool($scope.NewSkillData[x].agentless);
                    $scope.NewSkillData[x].countOtherAbandons = parseBool($scope.NewSkillData[x].allowSecondaryDisposition);
                    $scope.NewSkillData[x].countReskillHours = parseBool($scope.NewSkillData[x].countOtherAbandons);
                    $scope.NewSkillData[x].countShortAbandons = parseBool($scope.NewSkillData[x].countReskillHours);
                    $scope.NewSkillData[x].displayThankyou = parseBool($scope.NewSkillData[x].displayThankyou);
                    $scope.NewSkillData[x].emailFromEditable = parseBool($scope.NewSkillData[x].emailFromEditable);
                    $scope.NewSkillData[x].enableShortAbandon = parseBool($scope.NewSkillData[x].enableShortAbandon);
                    $scope.NewSkillData[x].interruptible = parseBool($scope.NewSkillData[x].interruptible);
                    $scope.NewSkillData[x].isActive = parseBool($scope.NewSkillData[x].isActive);
                    $scope.NewSkillData[x].isOutbound = parseBool($scope.NewSkillData[x].isOutbound);
                    $scope.NewSkillData[x].isRunning = parseBool($scope.NewSkillData[x].isRunning);
                    $scope.NewSkillData[x].makeTranscriptAvailable = parseBool($scope.NewSkillData[x].makeTranscriptAvailable);
                    $scope.NewSkillData[x].popThankYou = parseBool($scope.NewSkillData[x].popThankYou);
                    $scope.NewSkillData[x].priorityBlending = parseBool($scope.NewSkillData[x].priorityBlending);
                    $scope.NewSkillData[x].requireDisposition = parseBool($scope.NewSkillData[x].requireDisposition);
                    $scope.NewSkillData[x].scriptDisposition = parseBool($scope.NewSkillData[x].scriptDisposition);
                    $scope.NewSkillData[x].useCustomScreenPops = parseBool($scope.NewSkillData[x].useCustomScreenPops);
                    $scope.NewSkillData[x].useScreenPops = parseBool($scope.NewSkillData[x].useScreenPops);
                }
                console.log($scope);
                $scope.showSpinner = false;
            },
            function(response){
                alert("BAD:" + JSON.stringify(response));
            }
        );
        // icSOAPServices.icGet("Skill_GetList").then(
        //     function(data){
        //         var orderedlist;
        //         orderedlist = orderBy(data, "SkillName", false);
        //         $scope.SkillData = orderedlist;
        //         for (var x =0;x<data.length;x++){
        //             $scope.SkillData[x].index = x;
        //         }
        //         $scope.showSpinner = false;
        //     },
        //     function(response){
        //         $scope.showSpinner = false;
        //         alert("BAD:" + JSON.stringify(response));
        //     }
        // );
        //icSOAPServices.icGet("Script_GetList").then(
        //    function(data){
        //        var orderedscriptlist;
        //        orderedscriptlist = orderBy(data, "ScriptName", false);
        //        $scope.ScriptData = orderedscriptlist;
        //        $scope.showSpinner = false;
        //    },
        //    function(response){
        //        $scope.showSpinner = false;
        //        alert("BAD:" + JSON.stringify(response));
        //    }
        //);
       $scope.ModSkill = function(skillData){
            SOAPClient.passData = skillData;
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
        };
        $scope.SkillList = function(){
            $location.path("/skillList");
        }

    }]);