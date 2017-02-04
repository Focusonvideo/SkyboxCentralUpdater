/**
 * Created by Chester on 1/28/2017.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('AgentSkillCtrl', ['$scope', 'icSOAPServices', '$location', '$filter',  function($scope, icSOAPServices, $location, $filter) {
        var filter = "&isActive=true";
        var skillIdx = 0;
        var agentID = "";

        String.prototype.replaceAll = function (find, replace) {
            var str = this;
            return str.replace(new RegExp(find, 'g'), replace);
        };
        $scope.showSpinner = true;
        $scope.modAgentSelected = "";
        $scope.newAssociated = "";
        $scope.showAddConfig = false;
        $scope.showUseConfig = false;
        var orderBy = $filter('orderBy');
        var token = SOAPClient.ICToken;
//        var extURL = 'services/v8.0/skills?orderBy=skillName,campaignName';
        var extURL = 'services/v8.0/skills?orderBy=skillName&isActive=true';

        icSOAPServices.ICGET(token, extURL).then(
            function(data){
                // $scope.showSpinner = false;
                var orderedlist = orderBy(data.data.skills, "campaignName", false);
                $scope.SkillData = orderedlist;
                getAgents();
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        // console.log($scope);
        var getAgents = function() {
 //           extURL = 'services/v8.0/agents?orderBy=lastName,teamName';
            extURL = 'services/v8.0/agents?orderBy=lastName&isActive=true';
            icSOAPServices.ICGET(token, extURL).then(
                function (data) {
                    var orderedlist = orderBy(data.data.agents, "lastName", false);
                    orderedlist = orderBy(orderedlist,"teamName",false);
                    $scope.AgentData = orderedlist;
                    for (var x=0;x<$scope.AgentData.length;x++){
                        $scope.AgentData[x].agentName = $scope.AgentData[x].firstName + " " + $scope.AgentData[x].lastName + " - " + $scope.AgentData[x].teamName;
                    }
                    $scope.showSpinner = false;
                },
                function (response) {
                    $scope.showSpinner = false;
                    alert("BAD:" + JSON.stringify(response));
                }
            );
        };
        $scope.AgentSelected = function(){
            $scope.showSpinner = true;
            for(var i=0;i<$scope.SkillData.length;i++){
                $scope.SkillData[i].AssocChanged = false;
                $scope.SkillData[i].assocAgentSkill = false;
                $scope.SkillData[i].index = i;
            }
            $scope.CurrentTeam = "";
            $scope.SkillOrigData = JSON.parse(JSON.stringify($scope.SkillData));
            for (var x=0;x<$scope.AgentData.length;x++){
                if($scope.modAgentSelected == $scope.AgentData[x].agentName){
                    skillIdx = x;
                    agentID =  $scope.AgentData[x].agentId;
                    break;
                }
            }
            if (agentID > 0) {
                extURL = 'services/v8.0/agents/' + agentID + '/skills?orderBy=skillName&isSkillActive=true';
                icSOAPServices.ICGET(token, extURL).then(
                    function (data) {
                        $scope.agentskill = data.data.resultSet.agentSkillAssignments;
                         for (var x=0;x<$scope.agentskill.length;x++){
                             for (var y=0;y<$scope.SkillData.length;y++){
                                 if($scope.agentskill[x].skillId == $scope.SkillData[y].skillId){
                                     $scope.SkillData[y].assocAgentSkill = true;
                                     break;
                                 }
                             }
                         }
                        $scope.showSpinner = false;
                        $scope.showAddConfig = true;
                        // console.log($scope);
                     },
                    function (response) {
                        $scope.showSpinner = false;
                        alert("BAD:" + JSON.stringify(response));
                    }
                );

            }
         // console.log($scope);
            // $scope.showAddConfig = true;

        };
         $scope.assocAgentSkillChanged = function(index){
            $scope.SkillData[index].AssocChanged = true;
        };


        $scope.SaveConfig = function(){
            $scope.savedDataConfig = new Array($scope.SkillData.length);
            for (var x=0;x < $scope.SkillData.length; x++) {
                $scope.savedDataConfig[x]= {
                    assocAgentSkill : $scope.SkillData[x].assocAgentSkill
                }
            }
            $scope.showUseConfig = true;
        };
        $scope.UseConfig = function(){
            for (var x = 0; x < $scope.SkillData.length; x++) {
                if ($scope.SkillData[x].assocAgentSkill != $scope.savedDataConfig[x].assocAgentSkill){
                    $scope.SkillData[x].assocAgentSkill = $scope.savedDataConfig[x].assocAgentSkill;
                    $scope.SkillData[x].AssocChanged = true;
                }
            }
        };
        $scope.SetAll = function(){
            for (var x = 0; x < $scope.SkillData.length; x++) {
                    $scope.SkillData[x].assocAgentSkill = true;
                    $scope.SkillData[x].AssocChanged = true;
             }
        };
        $scope.ClearAll = function(){
            for (var x = 0; x < $scope.SkillData.length; x++) {
                    $scope.SkillData[x].assocAgentSkill = false;
                    $scope.SkillData[x].AssocChanged = true;
            }
        };
        $scope.UpdateAgentSkill = function() {
            $scope.showSpinner = true;
            var addList = [];
            var deleteList = [];
            var addIdx = 0;
            var deleteIdx = 0;
            var doAdd = false;
            var doDelete = false;
            for (var x = 0; x < $scope.SkillData.length; x++) {
                if ($scope.SkillData[x].AssocChanged){
                    if ($scope.SkillData[x].assocAgentSkill){
                        // set add
                        addList[addIdx] = {
                            skillId:$scope.SkillData[x].skillId,
                            proficiency:3,
                            isActive:true
                        };
                        addIdx++;
                        doAdd = true;
                    }else{
                        // set delete
                        deleteList[deleteIdx] = {
                            skillId:$scope.SkillData[x].skillId
                        };
                        deleteIdx++;
                        doDelete = true;
                    }
                }

            }
            var addjson = {skills:addList};
            var deletejson = {skills:deleteList};
            // console.log(JSON.stringify(addjson));
            // console.log(JSON.stringify(deletejson));
            extURL = 'services/v8.0/agents/' + agentID + '/skills';
            if (doAdd) {
                icSOAPServices.ICPOST(token, extURL, addjson).then(
                    function (data) {
                        $scope.AddReturn = data.data;
                        // console.log($scope);
                        if (doDelete) {
                            extURL = 'services/v8.0/agents/' + agentID + '/skills';
                            icSOAPServices.ICDELETE(token, extURL, deletejson).then(
                                function (data) {
                                    $scope.deletereturn = data.data;
                                    $scope.showSpinner = false;
                                    // console.log($scope);
                                },
                                function (response) {
                                    $scope.showSpinner = false;
                                    alert("BAD:" + JSON.stringify(response));
                                }
                            );
                        }else{
                            $scope.showSpinner = false;
                        }
                    },
                    function (response) {
                        $scope.showSpinner = false;
                        alert("BAD:" + JSON.stringify(response));
                    }
                );
            }else{
                if (doDelete){
                    extURL = 'services/v8.0/agents/' + agentID + '/skills';
                    icSOAPServices.ICDELETE(token, extURL, deletejson).then(
                        function (data) {
                            $scope.deletereturn = data.data;
                            $scope.showSpinner = false;
                            // console.log($scope);
                        },
                        function (response) {
                            $scope.showSpinner = false;
                            alert("BAD:" + JSON.stringify(response));
                        }
                    );
                }else{
                    $scope.showSpinner = false;
                }
            }


         };


    }]);