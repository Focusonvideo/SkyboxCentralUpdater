/**
 * Created by Chester on 3/24/16.
 */
'use strict';

var app = angular.module('SkyboxApp');

app.controller('SkillListModCtrl', ['$scope', 'icSOAPServices', '$location', '$filter', function ($scope, icSOAPServices, $location, $filter) {
    var orderBy = $filter('orderBy');
    var filter = "";
    var typeId;
    var OB = true;
    var searchString = "";
    $scope.SkillFilterSel = "ALL";
    $scope.showSpinner = true;
    $scope.skillTypes = new Array(4);
    $scope.skillFilterTypes = new Array(3);
    $scope.skillTypes[3] = {name : "Chat"};
    $scope.skillTypes[0] = {name : "Phone Call IB"};
    $scope.skillTypes[4] = {name : "Phone Call OB"};
    $scope.skillTypes[1] = {name : "Voice Mail"};
    $scope.skillTypes[2] = {name : "EMail"};
    $scope.skillFilterTypes[0] = {name : "All"};
    $scope.skillFilterTypes[1] = {name : "Active"};
    $scope.skillFilterTypes[2] = {name : "InActive"};
    $scope.skillStatus = new Array;
    $scope.skillStatus[0] = {Status:"true"};
    $scope.skillStatus[1] = {Status:"false"};
    $scope.ACWType = new Array(4);
    $scope.ACWType[0] = "";
    $scope.ACWType[1] = "None";
    $scope.ACWType[2] = "Disp.";
    $scope.ACWType[3] = "Auto Disp.";
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
        var extURL = 'services/v13.0/scripts?isactive=true&testing=true';
        icSOAPServices.ICGET(token, extURL).then(
            function(data){
//                alert(JSON.stringify(data.data.resultSet.scripts));
                var orderedlist;
                orderedlist = orderBy(data.data.resultSet.scripts, "scriptName", false);
                $scope.allScripts = orderedlist;

                var no_script = {"scriptName" : "None", "scriptId" : "0"};

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
                $scope.script1[t1] = no_script;
                $scope.script2[t2] = no_script;
                $scope.script3[t3] = no_script;
                $scope.script4[t4] = no_script;
                $scope.script0[t0] = no_script;
                getBU();
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }

        );

    }
    function getBU(){
        var token = SOAPClient.ICToken;
        var extURL = 'services/v13.0/business-unit';
        icSOAPServices.ICGET(token, extURL).then(
            function(data){
//                alert(JSON.stringify(data));
//                alert(JSON.stringify(data.data.businessUnits[0]));
                var blending = data.data.businessUnits[0].priorityBasedBlending;
                $scope.bu = data.data.businessUnits[0];
                $scope.blending = false;
                var dq = '"';
                $scope.blendingDisabled = "disabled=" + dq + "Disabled" + dq;
                if (blending == "true"){
                	$scope.blending = true;
                	$scope.blendingDisabled = "";
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
    $scope.skillFilterSelected = function() {
        switch ($scope.SkillFilterSel){
            case "All": {
                filter = "";
                break;
            }
            case "Active": {
                filter = "&isActive=true";
                break;
            }
            case "InActive": {
                filter = "&isActive=false";
                break;
            }
        }
        if (($scope.SkillTypeSel != "") && ($scope.SkillTypeSel != undefined)) {
            $scope.skillTypeSelected();
        }
    };
    $scope.blendChange = function(idx){
        if (($scope.SkillData[idx].priorityBlending) || (!$scope.SkillData[idx].isOutbound)){
            $scope.SkillData[idx].priDisabled = false;
        }else{
            $scope.SkillData[idx].priDisabled = true;
        }
    };
    $scope.skillTypeSelected = function(){
        $scope.showSpinner = true;
        switch ($scope.SkillTypeSel) {
            case "Phone Call IB":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = true;
                $scope.showFromAddress = false;
                $scope.showScript = false;
                typeId = 4;
 //               searchString = "&searchString=" + '"' + "isOutbound" + '"' + ":false";
                OB = false;
                break;
            }
            case "Voice Mail":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = true;
                $scope.showFromAddress = false;
                $scope.showScript = false;
                typeId = 5;
                searchString = "";
                break;
            }
            case "Chat":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = false;
                $scope.showFromAddress = false;
                $scope.showScript = true;
                searchString = "";
                typeId = 3;
                break;
            }
            case "EMail":{
                $scope.showCalledID = false;
                $scope.showOverride = false;
                $scope.showDirection = true;
                $scope.showFromAddress = true;
                $scope.showScript = false;
                searchString = "";
                typeId = 1;
                break;
            }
            case "Phone Call OB":{
                $scope.showCalledID = true;
                $scope.showOverride = true;
                $scope.showDirection = false;
                $scope.showFromAddress = false;
                $scope.showScript = true;
                typeId = 4;
//                searchString = "&searchString=" + '"' + "isOutbound" + '"' + ":true";
                OB = true;
                break;
            }
        }
        var token = SOAPClient.ICToken;
         var extURL = 'services/v13.0/skills?orderBy=skillName&mediaTypeId=' + typeId + filter + searchString;
 //        alert(extURL);
        icSOAPServices.ICGET(token, extURL).then(
            function(data){
                var orderedlist;
                $scope.CustomScript = new Array;
                $scope.CustomScript[0] = {'CustomScriptID' : 0,
                                        'CustomScriptName' : "" };
 //              alert(JSON.stringify(data));
                $scope.sk = data.data.skills;
 //               orderedlist = orderBy(data.data.skills, "skillName", false);
                orderedlist = data.data.skills;
                $scope.SkillDataOrig = new Array;
                var type = $scope.SkillTypeSel;

                var y = 0;
                for (var x =0;x<orderedlist.length;x++) {

                        if(typeId ==4) {
                            if(orderedlist[x].isOutbound == OB) {

                                $scope.SkillDataOrig[y] = orderedlist[x];
                                $scope.SkillDataOrig[y].index = y;
                                if((orderedlist[x].priorityBlending) || (!orderedlist[x].isOutbound)) {
                                    $scope.SkillDataOrig[y].priDisabled = false;
                                }else{
                                    $scope.SkillDataOrig[y].priDisabled = true;
                                }
                                $scope.SkillDataOrig[y].Priority = $scope.SkillDataOrig[y].initialPriority + "|" + $scope.SkillDataOrig[y].acceleration + "|" + $scope.SkillDataOrig[y].maxPriority;
                                $scope.SkillDataOrig[y].SLA = $scope.SkillDataOrig[y].serviceLevelThreshold + "/" + $scope.SkillDataOrig[y].serviceLevelGoal;
                                $scope.SkillDataOrig[y].ShortAbandon = $scope.SkillDataOrig[y].enableShortAbandon + ", " + $scope.SkillDataOrig[y].shortAbandonThreshold;
                                $scope.SkillDataOrig[y].ACWDisposition = $scope.ACWType[$scope.SkillDataOrig[y].acwTypeId];
                                 y++
                            }
                        }else{
                            $scope.SkillDataOrig[y] = orderedlist[x];
                            $scope.SkillDataOrig[y].index = y;
                            $scope.SkillDataOrig[y].Priority = $scope.SkillDataOrig[y].initialPriority + "|" + $scope.SkillDataOrig[y].acceleration + "|" + $scope.SkillDataOrig[y].maxPriority;
                            $scope.SkillDataOrig[y].SLA = $scope.SkillDataOrig[y].serviceLevelThreshold + "/" + $scope.SkillDataOrig[y].serviceLevelGoal;
                            $scope.SkillDataOrig[y].ShortAbandon = $scope.SkillDataOrig[y].enableShortAbandon + ", " + $scope.SkillDataOrig[y].shortAbandonThreshold;
                            $scope.SkillDataOrig[y].ACWDisposition = $scope.ACWType[$scope.SkillDataOrig[y].acwTypeId];
                             y++;
                        }

                }
                switch (type){
                    case "Phone Call OB":
                    case "Phone Call IB":
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
            if ($scope.CampaignData[w].CampaignName == $scope.SkillData[idx].campaignName){
                $scope.SkillData[idx].campaignId = $scope.CampaignData[w].CampaignNo;
            }
        }
    };
    $scope.scriptChanged = function(idx){
        for(var w=0;w<$scope.CustomScript.length;w++){
            if ($scope.CustomScript[w].scriptName == $scope.SkillData[idx].scriptName){
                $scope.SkillData[idx].scriptId = $scope.CustomScript[w].scriptId;
            }
        }
    };
    function SkillChanged(idx){
        var dq = '"';
        var changed = "{";
        if($scope.SkillData[idx].skillName != $scope.SkillDataOrig[idx].skillName) {
                if ($scope.SkillData[idx].skillName.length > 30){
                    alert($scope.SkillData[idx].skillName + " Skill Name too long! 30 char. or less");
                    return null;
                }
                changed = changed + dq + "skillName" + dq + " : " + dq + $scope.SkillData[idx].skillName + dq + ",";
        }
        if($scope.SkillData[idx].isActive != $scope.SkillDataOrig[idx].isActive) {
            changed = changed + dq + "isActive" + dq + " : " + dq + $scope.SkillData[idx].isActive + dq + ",";
        }
        if($scope.SkillData[idx].campaignName != $scope.SkillDataOrig[idx].campaignName) {
//            changed = changed + dq + "campaignId" + dq + " : " + dq + $scope.SkillData[idx].campaignId + dq + ",";
            changed = changed + dq + "campaignId" + dq + " : "  + $scope.SkillData[idx].campaignId + ",";
        }
        if($scope.SkillData[idx].callerIdOverride != $scope.SkillDataOrig[idx].callerIdOverride) {
           changed = changed + dq + "callerIdOverride" + dq + " : " + dq + $scope.SkillData[idx].callerIdOverride + dq + ",";
        }
        if($scope.SkillData[idx].agentless != $scope.SkillDataOrig[idx].agentless) {

             if ($scope.SkillData[idx].agentless){
                 changed = changed + dq + "agentless" + dq + " : " + dq  +  $scope.SkillData[idx].agentless + dq   + ",";
                 changed = changed + "\"agentlessPorts\":1,";
                 changed = changed + "\"acwTypeId\":1,";
             }else{
                 changed = changed + "\"agentlessPorts\":{},";
                 changed = changed + dq + "agentless" + dq + " : " + dq  +  $scope.SkillData[idx].agentless + dq   + ",";
             }
        }

        if($scope.SkillData[idx].SLA != $scope.SkillDataOrig[idx].SLA) {
            var thresh_goal = $scope.SkillData[idx].SLA.split("/");
//            changed = changed + dq + "serviceLevelThreshold" + dq + " : " + dq + thresh_goal[0] + dq + ",";
//            changed = changed + dq + "serviceLevelGoal" + dq + " : " + dq + thresh_goal[1] + dq + ",";
            changed = changed + dq + "serviceLevelThreshold" + dq + " : "  + thresh_goal[0]  + ",";
            changed = changed + dq + "serviceLevelGoal" + dq + " : "  + thresh_goal[1]  + ",";
        }
        if($scope.SkillData[idx].ShortAbandon != $scope.SkillDataOrig[idx].ShortAbandon) {
            var esa_sat = $scope.SkillData[idx].ShortAbandon.split(",");
 //           changed = changed + dq + "enableShortAbandon" + dq + " : " + dq + esa_sat[0] + dq + ",";
 //           changed = changed + dq + "shortAbandonThreshold" + dq + " : " + dq + esa_sat[1].trim() + dq + ",";
            changed = changed + dq + "enableShortAbandon" + dq + " : "  + esa_sat[0]  + ",";
            changed = changed + dq + "shortAbandonThreshold" + dq + " : "  + esa_sat[1].trim()  + ",";
        }
        if($scope.SkillData[idx].Priority != $scope.SkillDataOrig[idx].Priority) {
            var IAM = $scope.SkillData[idx].Priority.split("|");
            // changed = changed + dq + "initailPriority" + dq + " : " + dq + IAM[0] + dq + ",";
            // changed = changed + dq + "acceleraation" + dq + " : " + dq + IAM[1] + dq + ",";
            // changed = changed + dq + "maxPriority" + dq + " : " + dq + IAM[2] + dq + ",";
            changed = changed + dq + "initailPriority" + dq + " : " +  IAM[0]  + ",";
            changed = changed + dq + "acceleraation" + dq + " : " +  IAM[1]  + ",";
            changed = changed + dq + "maxPriority" + dq + " : " +  IAM[2]  + ",";
        }
        if($scope.SkillData[idx].priorityBlending != $scope.SkillDataOrig[idx].priorityBlending) {
//            changed = changed + dq + "priorityBlending" + dq + " : " + dq + $scope.SkillData[idx].priorityBlending + dq + ",";
            changed = changed + dq + "priorityBlending" + dq + " : "  + $scope.SkillData[idx].priorityBlending  + ",";
        }
        if($scope.SkillData[idx].UseDispositions != $scope.SkillDataOrig[idx].UseDispositions) {
 //           changed = true;
        }
        if($scope.SkillData[idx].requireDispositions != $scope.SkillDataOrig[idx].requireDispositions) {
              changed = changed + dq + "requireDispositions" + dq + " : " + dq + $scope.SkillData[idx].requireDispositions + dq + ",";
        }
        if($scope.SkillData[idx].emailFromAddress != $scope.SkillDataOrig[idx].emailFromAddress) {

 //           changed = true;
        }
        if($scope.SkillData[idx].scriptName != $scope.SkillDataOrig[idx].scriptName)  {
//            changed = changed + dq + "scriptId" + dq + " : " + dq + $scope.SkillData[idx].scriptId + dq + ",";
            changed = changed + dq + "scriptId" + dq + " : "  + $scope.SkillData[idx].scriptId  + ",";
        }
        var idx = changed.lastIndexOf(",");
        if (idx != -1) {
            changed = "{" + dq + "skill" + dq + ":" + changed.substr(0, idx) + "}}";
             var updateJSON = JSON.parse(changed);
//            alert(JSON.stringify(updateJSON));
        }else{
            changed = null;
        }
        return changed;
    }
    $scope.UpdateSkills = function(){
        $scope.showSpinner = true;
        var token = SOAPClient.ICToken;
        var extURL = 'services/v14.0/skills/';

        var updatecount = 0;
        for (var x=0;x<$scope.SkillData.length;x++){
            var updateJSON = SkillChanged(x);
            if (updateJSON != null){
                updatecount++;
                console.log(extURL + $scope.SkillData[x].skillId);
                console.log(JSON.stringify(updateJSON));
                icSOAPServices.ICPUT(token,extURL + $scope.SkillData[x].skillId,updateJSON).then(
                    function () {
                        updatecount--;
                        if (updatecount == 0) {
                            $scope.showSpinner = false;
                            $location.path("/skill");
                        }
                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                        updatecount--;
                        if (updatecount == 0) {
                            $scope.showSpinner = false;
                            $location.path("/skill");
                        }
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