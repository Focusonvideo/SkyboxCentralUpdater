/**
 * Created by Chester on 3/24/16.
 */
'use strict';

var app = angular.module('SkyboxApp');

app.controller('SkillListModCtrl', ['$scope', 'icSOAPServices', '$location', '$filter', function ($scope, icSOAPServices, $location, $filter) {
    var orderBy = $filter('orderBy');
    $scope.showSpinner = true;
    $scope.skillTypes = new Array(4);
    $scope.skillTypes[3] = {name : "Chat"};
    $scope.skillTypes[0] = {name : "PhoneCall"};
    $scope.skillTypes[4] = {name : "PhoneCall OB"};
    $scope.skillTypes[1] = {name : "VoiceMail"};
    $scope.skillTypes[2] = {name : "EMail"};
    $scope.skillStatus = new Array;
    $scope.skillStatus[0] = {Status:"Active"};
    $scope.skillStatus[1] = {Status:"InActive"};
    $scope.showTable = false;
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find, 'g'), replace);
    };
    icSOAPServices.icGet("Campaign_GetList").then(
        function(data){
            var orderedlist;
            orderedlist = orderBy(data, "CampaignName", false);
            $scope.CampaignData = orderedlist;
            getScripts();
        },
        function(response){
            $scope.showSpinner = false;
            alert("BAD:" + JSON.stringify(response));
        }
    );
    function getScripts(){
        var token = SOAPClient.ICToken;
        var extURL = 'services/v7.0/scripts?isactive=true&testing=true';
        icSOAPServices.ICGET(token, extURL).then(
            function(data){
//                alert(JSON.stringify(data.data.resultSet.scripts));
                var orderedlist;
                orderedlist = orderBy(data.data.resultSet.scripts, "scriptName", false);
                $scope.allScripts = orderedlist;

                var t1 = 0;
                var t2 = 0;
                var t3 = 0;
                var t4 = 0;
                var t0 = 0;
                $scope.script1 = new Array;
                $scope.script2 = new Array;
                $scope.script3 = new Array;
                $scope.script4 = new Array;
                $scope.script0 = new Array;
                for (var x=0;x<$scope.allScripts.length;x++){
                    var scr = $scope.allScripts[x];
                    switch (scr.mediaTypeId) {
                        case "1":
                            $scope.script1[t1] = scr;
                            t1++;
                            break;
                        case "2":
                            $scope.script2[t2] = scr;
                            t2++;
                            break;
                        case "3":
                            $scope.script3[t3] = scr;
                            t3++;
                            break;
                        case "4":
                            $scope.script4[t4] = scr;
                            t4++;
                            break;
                        case "0":
                            $scope.script0[t0] = scr;
                            t0++;
                            break;
                    }
                }
                console.log($scope);
                $scope.showSpinner = false;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }

        );

    }

    $scope.skillTypeSelected = function(){
        $scope.showSpinner = true;
        switch ($scope.SkillTypeSel) {
            case "PhoneCall":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = true;
                $scope.showFromAddress = false;
                $scope.showScript = false;
                break;
            }
            case "VoiceMail":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = true;
                $scope.showFromAddress = false;
                $scope.showScript = false;
                break;
            }
            case "Chat":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = false;
                $scope.showFromAddress = false;
                $scope.showScript = false;
                break;
            }
            case "EMail":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = true;
                $scope.showFromAddress = true;
                $scope.showScript = false;
                break;
            }
            case "PhoneCall OB":{
                $scope.showCalledID = true;
                $scope.showOverride = true;
                $scope.showDirection = false;
                $scope.showFromAddress = false;
                $scope.showScript = true;
                break;
            }
        }
        icSOAPServices.icGet("Skill_GetList").then(
            function(data){
                var orderedlist;
                $scope.CustomScript = new Array;
                $scope.CustomScript[0] = {'CustomScriptID' : 0,
                                        'CustomScriptName' : "" };
                orderedlist = orderBy(data, "SkillName", false);
                $scope.SkillDataOrig = new Array;
                var type = $scope.SkillTypeSel;
                if(type == "PhoneCall OB"){
                    type = "PhoneCall";
                }

                var y = 0;
                for (var x =0;x<orderedlist.length;x++) {
                    if (orderedlist[x].MediaType == type) {
                        if(type == $scope.SkillTypeSel) {
                            $scope.SkillDataOrig[y] = orderedlist[x];
                            $scope.SkillDataOrig[y].index = y;
                            $scope.SkillDataOrig[y].Priority = $scope.SkillDataOrig[y].QueueInitPriority + "|" + $scope.SkillDataOrig[y].QueueAcceleration + "|" + $scope.SkillDataOrig[y].QueueMaxPriority;
                            $scope.SkillDataOrig[y].SLA = $scope.SkillDataOrig[y].SLASeconds + "/" + $scope.SkillDataOrig[y].SLAPercent;
                            $scope.SkillDataOrig[y].ShortAbandon = $scope.SkillDataOrig[y].UseShortAbandonThreshold + ", " + $scope.SkillDataOrig[y].ShortAbandonThreshold;
 /*                           if ($scope.SkillDataOrig[y].CustomScriptID != 0) {
                                var found = false;
                                var scriptIdx = $scope.CustomScript.length;
                                for (var w = 0; w < scriptIdx; w++) {
                                    if ($scope.CustomScript[w].CustomScriptID == $scope.SkillDataOrig[y].CustomScriptID) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    $scope.CustomScript[scriptIdx] = {
                                        'CustomScriptID': $scope.SkillDataOrig[y].CustomScriptID,
                                        'CustomScriptName': $scope.SkillDataOrig[y].CustomScriptName
                                    };
                                }
                            }
*/                            y++
                        }else{
                            if(orderedlist[x].OutboundSkill) {
                                $scope.SkillDataOrig[y] = orderedlist[x];
                                $scope.SkillDataOrig[y].index = y;
                                $scope.SkillDataOrig[y].Priority = $scope.SkillDataOrig[y].QueueInitPriority + "|" + $scope.SkillDataOrig[y].QueueAcceleration + "|" + $scope.SkillDataOrig[y].QueueMaxPriority;
                                $scope.SkillDataOrig[y].SLA = $scope.SkillDataOrig[y].SLASeconds + "/" + $scope.SkillDataOrig[y].SLAPercent;
                                $scope.SkillDataOrig[y].ShortAbandon = $scope.SkillDataOrig[y].UseShortAbandonThreshold + ", " + $scope.SkillDataOrig[y].ShortAbandonThreshold;
                                //if ($scope.SkillDataOrig[y].CustomScriptID != 0) {
                                //    var found = false;
                                //    var scriptIdx = $scope.CustomScript.length;
                                //    for (var w = 0; w < scriptIdx; w++) {
                                //        if ($scope.CustomScript[w].CustomScriptID == $scope.SkillDataOrig[y].CustomScriptID) {
                                //            found = true;
                                //            break;
                                //        }
                                //    }
                                //    if (!found) {
                                //        $scope.CustomScript[scriptIdx] = {
                                //            'CustomScriptID': $scope.SkillDataOrig[y].CustomScriptID,
                                //            'CustomScriptName': $scope.SkillDataOrig[y].CustomScriptName
                                //        };
                                //    }
                                //}
                                y++;
                            }
                        }
                    }
                }
                switch (type){
                    case "PhoneCall":
                        $scope.CustomScript = $scope.script4;
                        break;
                    case "Chat":
                        $scope.CustomScript = $scope.script3;
                        break;
                    case "Email":
                        $scope.CustomScript = $scope.script1;
                        break;
                }
                $scope.SkillData = JSON.parse(JSON.stringify($scope.SkillDataOrig));

                $scope.showSpinner = false;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        console.log($scope);
    };
    $scope.campChanged = function(idx){
        for(var w=0;w<$scope.CampaignData.length;w++){
            if ($scope.CampaignData[w].CampaignName == $scope.SkillData[idx].CampaignName){
                $scope.SkillData[idx].CampaignNo = $scope.CampaignData[w].CampaignNo;
            }
        }
    };
    $scope.scriptChanged = function(idx){
        for(var w=0;w<$scope.CustomScript.length;w++){
            if ($scope.CustomScript[w].CustomScriptName == $scope.SkillData[idx].CustomScriptName){
                $scope.SkillData[idx].CustomScriptID = $scope.CustomScript[w].CustomScriptID;
            }
        }
    };
    function SkillChanged(idx){
        var changed = false;
        if($scope.SkillData[idx].SkillName != $scope.SkillDataOrig[idx].SkillName) changed = true;
        if($scope.SkillData[idx].Status != $scope.SkillDataOrig[idx].Status) changed = true;
        if($scope.SkillData[idx].CampaignName != $scope.SkillDataOrig[idx].CampaignName) changed = true;
        if($scope.SkillData[idx].OutboundSkill != $scope.SkillDataOrig[idx].OutboundSkill) changed = true;
        if($scope.SkillData[idx].OverrideCallerID != $scope.SkillDataOrig[idx].OverrideCallerID) changed = true;
        if($scope.SkillData[idx].CallerIDNumber != $scope.SkillDataOrig[idx].CallerIDNumber) changed = true;
        if($scope.SkillData[idx].SLA != $scope.SkillDataOrig[idx].SLA) changed = true;
        if($scope.SkillData[idx].ShortAbandon != $scope.SkillDataOrig[idx].ShortAbandon) changed = true;
        if($scope.SkillData[idx].Priority != $scope.SkillDataOrig[idx].Priority) changed = true;
        if($scope.SkillData[idx].EnableBlending != $scope.SkillDataOrig[idx].EnableBlending) changed = true;
        if($scope.SkillData[idx].UseDispositions != $scope.SkillDataOrig[idx].UseDispositions) changed = true;
        if($scope.SkillData[idx].RequireDispositions != $scope.SkillDataOrig[idx].RequireDispositions) changed = true;
        if($scope.SkillData[idx].FromEmailAddress != $scope.SkillDataOrig[idx].FromEmailAddress) changed = true;
        if($scope.SkillData[idx].CustomScriptName != $scope.SkillDataOrig[idx].CustomScriptName) changed = true;
        return changed;
    }
    $scope.UpdateSkills = function(){
        $scope.showSpinner = true;
        var updatecount = 0;
        for (var x=0;x<$scope.SkillData.length;x++){
            if(SkillChanged(x)){
                var sla = $scope.SkillData[x].SLA.split("/");
                $scope.SkillData[x].SLASeconds = sla[0].trim();
                $scope.SkillData[x].SLAPercent = sla[1].trim();
                var sa = $scope.SkillData[x].ShortAbandon.split(",");
                $scope.SkillData[x].UseShortAbandonThreshold = sa[0].trim();
                $scope.SkillData[x].ShortAbandonThreshold = sa[1].trim();
                var pri = $scope.SkillData[x].Priority.split("|");
                $scope.SkillData[x].QueueInitPriority = pri[0].trim();
                $scope.SkillData[x].QueueAcceleration = pri[1].trim();
                $scope.SkillData[x].QueueMaxPriority = pri[2].trim();
                var parm = {
                    skill: {
                        "SkillNo": $scope.SkillData[x].SkillNo,
                        "SkillName": $scope.SkillData[x].SkillName,
                        "MediaType": $scope.SkillData[x].MediaType,
                        "Status": $scope.SkillData[x].Status,
                        "CampaignNo": $scope.SkillData[x].CampaignNo,
                        "OutboundSkill": $scope.SkillData[x].OutboundSkill,
                        "SLASeconds": $scope.SkillData[x].SLASeconds,
                        "SLAPercent": $scope.SkillData[x].SLAPercent,
                        "Notes": $scope.SkillData[x].Notes,
                        "Description": $scope.SkillData[x].Description,
                        "Interruptible": $scope.SkillData[x].Interruptible,
                        "FromEmailEditable": $scope.SkillData[x].FromEmailEditable,
                        "FromEmailAddress": $scope.SkillData[x].FromEmailAddress ,
                        "BccEmailAddress": $scope.SkillData[x].BccEmailAddress,
                        "UseDispositions": $scope.SkillData[x].UseDispositions,
                        "RequireDispositions": $scope.SkillData[x].RequireDispositions,
                        "DispositionTimer": $scope.SkillData[x].DispositionTimer,
                        "QueueInitPriority": $scope.SkillData[x].QueueInitPriority,
                        "QueueAcceleration": $scope.SkillData[x].QueueAcceleration,
                        "QueueFunction": $scope.SkillData[x].QueueFunction,
                        "QueueMaxPriority": $scope.SkillData[x].QueueMaxPriority,
                        "ActiveMinWorkTime": $scope.SkillData[x].ActiveMinWorkTime,
                        "OverrideCallerID": $scope.SkillData[x].OverrideCallerID,
                        "CallerIDNumber": $scope.SkillData[x].CallerIDNumber,
                        "UseScreenPops": $scope.SkillData[x].UseScreenPops,
                        "CustomScreenPopApp": $scope.SkillData[x].CustomScreenPopApp,
                        "CampaignName": $scope.SkillData[x].CampaignName,
                        "ShortAbandonThreshold": $scope.SkillData[x].ShortAbandonThreshold,
                        "UseShortAbandonThreshold": $scope.SkillData[x].UseShortAbandonThreshold,
                        "IncludeShortAbandons": $scope.SkillData[x].IncludeShortAbandons,
                        "IncludeOtherAbandons": $scope.SkillData[x].IncludeOtherAbandons,
                        "CustomScriptID": $scope.SkillData[x].CustomScriptID,
                        "CustomScriptName": $scope.SkillData[x].CustomScriptName,
                        "EnableBlending": $scope.SkillData[x].EnableBlending

                    }
                };
                if (parm.skill.Notes == null || parm.skill.Notes == undefined ) {
                    parm.skill.Notes = "";
                }
                if (parm.skill.Description == null || parm.skill.Description == undefined) {
                    parm.skill.Description = "";
                }
                if (parm.skill.FromEmailAddress == null  || parm.skill.FromEmailAddress == undefined){
                    parm.skill.FromEmailAddress = "";
                }
                if (parm.skill.BccEmailAddress == null || parm.skill.BccEmailAddress == undefined){
                    parm.skill.BccEmailAddress = "";
                }
                if (parm.skill.CustomScreenPopApp == null || parm.skill.CustomScreenPopApp == undefined){
                    parm.skill.CustomScreenPopApp = "";
                }
                if (parm.skill.CustomScriptName == null || parm.skill.CustomScriptName == undefined){
                    parm.skill.CustomScriptName = "";
                }
                if (parm.skill.CustomScriptName == null || parm.skill.CustomScriptName == undefined){
                    parm.skill.CustomScriptName = "";
                }
                if (parm.skill.CallerIDNumber == null || parm.skill.CallerIDNumber == undefined){
                    parm.skill.CallerIDNumber = "";
                }
                updatecount++;
                icSOAPServices.icGet("Skill_Update", parm).then(
                    function () {
                        updatecount--;
                        if (updatecount == 0) {
                            $scope.showSpinner = false;
                            $location.path("/skill");
                        }
                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                    }
                );

            }
        }
        if (updatecount == 0){
            $scope.showSpinner = false;
            $location.path("/skill");
        }
    }
}]);