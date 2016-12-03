/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('POCCtrl', ['$scope', 'icSOAPServices', '$location', '$filter',  function($scope, icSOAPServices, $location, $filter) {

        var orderBy = $filter('orderBy');

        $scope.showSpinner = true;
        var token = SOAPClient.ICToken;
        var extURL = 'services/v7.0/points-of-contact';
        var emailScripts =[];
        var chatScripts = [];
        var phoneScripts = [];
        var workItemScripts = [];
        var emailSkills =[];
        var chatSkills = [];
        var phoneSkills = [];
        var workItemSkills = [];
        $scope.disableUpdate = true;
        function parseBool(val) { return val === true || val === "True" }

        $scope.NewSkillData = {};

        icSOAPServices.ICGET(token,'services/v7.0/skills').then(
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

                    var idx;
                    switch($scope.NewSkillData[x].mediaTypeId){
                        case '1': {
                            idx = emailSkills.length;
                            emailSkills[idx] = {'skillName' : $scope.NewSkillData[x].skillName,
                                'skillId' : $scope.NewSkillData[x].skillId };}
                            break;
                        case '3': {
                            idx = chatSkills.length;
                            chatSkills[idx] = {'skillName' : $scope.NewSkillData[x].skillName,
                                'skillId' : $scope.NewSkillData[x].skillId };}
                            break;
                        case '4': {
                            idx = phoneSkills.length;
                            phoneSkills[idx] = {'skillName' : $scope.NewSkillData[x].skillName,
                                'skillId' : $scope.NewSkillData[x].skillId };}
                            break;
                        case '6': {
                            idx = workItemSkills.length;
                            workItemSkills[idx] = {'skillName' : $scope.NewSkillData[x].skillName,
                                 'skillId' : $scope.NewSkillData[x].skillId };}
                            break;

                    }

                }
                getScripts();

                console.log($scope);
                $scope.showSpinner = false;
            },
            function(response){
                alert("BAD:" + JSON.stringify(response));
            }
        );
        function getoldPOCs(){
            icSOAPServices.icGet("PointOfContact_GetList","").then(
                function(data){
                    $scope.POColdData = data;
                    $scope.showSpinner = false;
                    console.log($scope);
                },
                function(resp){
                    alert(resp);
                }
            )
        }
        function getPOCs() {
            icSOAPServices.ICGET(token, extURL).then(
                function (data) {
                    var orderedlist;

//                alert(JSON.stringify(data));
                    orderedlist = orderBy(data.data.pointsOfContact, "ContactAddress", false);
                    orderedlist = orderBy(orderedlist, "MediaTypeName", false);
                    $scope.POCData = orderedlist;
                    for (var x = 0; x < $scope.POCData.length; x++) {
                        $scope.POCData[x].idx = x;
                        $scope.POCData[x].changed = false;
                        $scope.POCData[x].IsActive = parseBool($scope.POCData[x].IsActive);
                        $scope.POCData[x].IsOutbound = parseBool($scope.POCData[x].IsOutbound);
                        for (var y = 0; y < $scope.NewSkillData.length; y++) {
                            if ($scope.NewSkillData[y].skillId == $scope.POCData[x].DefaultSkillId) {
                                $scope.POCData[x].DefaultSkillName = $scope.NewSkillData[y].skillName;
                            }
                        }
                        switch ($scope.POCData[x].MediaTypeId){
                            case 1: {
                                $scope.POCData[x].Scripts = emailScripts;
                                $scope.POCData[x].Skills = emailSkills;
                                break;
                            }
                            case 3: {
                                $scope.POCData[x].Scripts = chatScripts;
                                $scope.POCData[x].Skills = chatSkills;
                                break;
                            }
                            case 4: {
                                $scope.POCData[x].Scripts = phoneScripts;
                                $scope.POCData[x].Skills = phoneSkills;
                                break;
                            }
                            case 6: {
                                $scope.POCData[x].Scripts = workItemScripts;
                                $scope.POCData[x].Skills = workItemSkills;
                                break;
                            }
                        }
                    }
                    getoldPOCs();
                },
                function (response) {
                    $scope.showSpinner = false;
                    alert("BAD:" + JSON.stringify(response));
                }
            );
        }
        function getScripts(){
            icSOAPServices.ICGET(token,"services/v7.0/scripts?isActive=true").then(
                function(data){
                    var orderedlist;

                    orderedlist = orderBy(data.data.resultSet.scripts, "scriptName", false);
                    var scripts = orderedlist;
                    var idx;
                    $scope.scripts = scripts;
                    // need to sort scripts into 4 arrays for listing and later insert array into POCData
                    for (var x=0;x<scripts.length;x++){
                        switch($scope.scripts[x].mediaTypeId){
                            case '1': {
                                idx = emailScripts.length;
                                emailScripts[idx] = {'scriptName' : scripts[x].scriptName};}
                                break;
                            case '3': {
                                idx = chatScripts.length;
                                chatScripts[idx] = {'scriptName' : scripts[x].scriptName};}
                                break;
                            case '4': {
                                idx = phoneScripts.length;
                                phoneScripts[idx] = {'scriptName' : scripts[x].scriptName};}
                                break;
                            case '6': {
                                idx = workItemScripts.length;
                                workItemScripts[idx] = {'scriptName' : scripts[x].scriptName};}
                                break;

                        }
                    }
                    getPOCs();
                },
                function(resp){
                    alert(resp);
                }
            )
        }
        function get_old_idx(contactCode){
            var idx;
            for (var i=0;i<$scope.POColdData.length;i++){
                if ($scope.POColdData[i].ContactCode == contactCode){
                    idx = i;
                }
            }
            return idx;
        }
        $scope.changeDescription = function(idxData){
            $scope.disableUpdate = false;
            $scope.POCData[idxData].changed = true;

        };
        $scope.changeStatus = function(idxData){
            $scope.disableUpdate = false;
            $scope.POCData[idxData].changed = true;

        };
        $scope.changeNotes = function(idxData) {
            $scope.disableUpdate = false;
            $scope.POCData[idxData].changed = true;

        };
        $scope.newSkill = function(idxData, type_id){
            for (var x=0;x<$scope.POCData[idxData].Skills.length;x++){
                if($scope.POCData[idxData].Skills[x].skillName == $scope.POCData[idxData].DefaultSkillName){
                    $scope.POCData[idxData].DefaultSkillId = $scope.POCData[idxData].Skills[x].skillId;
                }
            }
            $scope.disableUpdate = false;
            $scope.POCData[idxData].changed = true;
        };
        $scope.newScript = function(idxData){
            $scope.disableUpdate = false;
            $scope.POCData[idxData].changed = true;

        };

        $scope.updatePOCs = function(){
            var not_found = true;
            $scope.showSpinner = true;
            for(var x=0;x<$scope.POCData.length;x++){
                if($scope.POCData[x].changed){
                    not_found = false;
                    processPOC(x);
                    break;
                }
            }
            if(not_found){
                $scope.showSpinner = false;
                $location.path("/main");
            }
        };
        function processPOC(idx){
            // put changes into old POC  table.
            var c_code = $scope.POCData[idx].ContactCode;
            var old_idx =  get_old_idx(c_code);

            // update all changing fields;
            var updateData = $scope.POColdData[old_idx];

            updateData.ContactDescription = $scope.POCData[idx].ContactDescription;
            if($scope.POCData[idx].IsActive){
                updateData.Status = "Active";
            }else {
                updateData.Status = "InActive";
            }
            updateData.Notes = $scope.POCData[idx].Notes;
            updateData.ScriptName = $scope.POCData[idx].ScriptName;
            updateData.DefaultSkillNo = $scope.POCData[idx].DefaultSkillId;

            delete updateData["LastModified"];
            delete updateData["logoURL"];
            if(updateData.ForwardToNumber == null){
                delete updateData["ForwardToNumber"];
            }


            switch (updateData.MediaType){
                case "EMail":{
                    delete updateData["ChatName"];
                    delete updateData["PhoneNumber"];
                    break;
                }
                case "PhoneCall":{
                    delete updateData["ChatName"];
                    delete updateData["EmailAddress"];
                    break;
                }
                case "Chat":{
                    if(updateData.ForwardToNumber == null){
                        delete updateData["ForwardToNumber"];
                    }
                    delete updateData["EmailAddress"];
                    delete updateData["PhoneNumber"];
                    break;
               }
                case "WorkItem":{
                    delete updateData["ChatName"];
                    delete updateData["EmailAddress"];
                    delete updateData["PhoneNumber"];
                    break;
                }
            }

            var params = {'pointOfContact':updateData};
            $scope.POCData[idx].changed = false;

            console.log(params);

            icSOAPServices.icGet("PointOfContact_Update", params).then(
                function (data) {
//                    alert("Update Completed");
                    $scope.updatePOCs();
                },
                function (response) {
                    alert("failed" + JSON.stringify(response));
                    $scope.showSpinner = false;
                }
            );
        }
        $scope.cancelUpdates = function(){
            $location.path("/main");
        }
    }]);