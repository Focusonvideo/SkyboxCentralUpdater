/**
 * Created by Chester on 2/17/16. ok
 */
'use strict';

var app = angular.module('SkyboxApp');
app.controller('SkillModCtrl', ['$scope', 'icSOAPServices', '$location', '$filter', function ($scope, icSOAPServices, $location, $filter) {
    $scope.showSpinner = true;
    $scope.buttonName = "UPDATE";
    var orderBy = $filter('orderBy')
    $scope.modSkillData = SOAPClient.passData;
    $scope.skillTypes = new Array(4);
    $scope.skillTypes[0] = {name : "Chat"};
    $scope.skillTypes[1] = {name : "PhoneCall"};
    $scope.skillTypes[2] = {name : "VoiceMail"};
    $scope.skillTypes[3] = {name : "EMail"};
    console.log($scope);
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find, 'g'), replace);
    };
    var phoneScripts = new Array();
    var chatScripts = new Array();
    var emailScripts = new Array();
    $scope.DispOpt = [
        {name: 'None'},
        {name: 'Disp.'},
        {name: 'Auto Wrap'}
    ];

    switch ($scope.modSkillData.acwTypeId) {
        case "1":
            $scope.modSkillData.UseDispositions = false;
            $scope.modSkillData.acwTypeName = "None";
            break;
        case "2":
            if ($scope.modSkillData.agentless) {
                $scope.modSkillData.UseDispositions = false;
            } else {
                $scope.modSkillData.UseDispositions = true;
            }
            $scope.modSkillData.acwTypeName = "Disp.";
            break;
        case "3":
            $scope.modSkillData.UseDispositions = false;
            $scope.modSkillData.acwTypeName = "Auto Wrap";
            break;
    }

    // if($scope.modSkillData.acwTypeID == undefined){
    //     $scope.modSkillData.UseDispositions = false;
    // }else{
    //     $scope.modSkillData.UseDispositions = true;
    // }



    icSOAPServices.icGet("Disposition_GetList").then(
      function(data){
          var orderList = orderBy(data, "DispositionName", false);
          var orderActiveList = new Array();
          var ctr = 0;
          for (var m=0;m<orderList.length;m++){
        	  if(orderList[m].Status == "Active"){
        		  orderActiveList[ctr] = orderList[m];
        		  ctr++;
        	  }
          }
          $scope.AllDispositions = orderActiveList;
          // add associated field
          for (var x=0;x<$scope.AllDispositions.length;x++){
              if ($scope.modSkillData.UseDispositions){
                  $scope.AllDispositions[x].associated = false;
                  $scope.AllDispositions[x].priority = "";
                   for (var y=0;y<$scope.modSkillData.dispositions.length;y++){
                       if($scope.modSkillData.dispositions[y].dispositionId == $scope.AllDispositions[x].DispositionID){
                           $scope.AllDispositions[x].associated = true;
                           $scope.AllDispositions[x].priority = $scope.modSkillData.dispositions[y].priority;
                       }
                   }
             }else {
                  $scope.AllDispositions[x].associated = false;
                  $scope.AllDispositions[x].priority = "";
              }
          }
          getScripts();
      },
      function(response){
          $scope.showSpinner = false;
          alert("bad:" + JSON.stringify(response));
      }

    );
    function getScripts(){
    	var token = SOAPClient.ICToken;
        icSOAPServices.ICGET(token,"services/v7.0/scripts?isActive=true").then(
            function(data){
                var orderedlist;
                console.log($scope);
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
                getCampaign();
            },
            function(resp){
                alert(resp);
            }
        )
    }

    function getCampaign() {
        icSOAPServices.icGet("Campaign_GetList").then(
            function (data) {
            	var found = false;
                var orderedlist = orderBy(data, "CampaignName", false);
                $scope.CampaignData = orderedlist;
                console.log($scope);
                if ($scope.modSkillData.CampaignName != "") {
                    for (var x = 0; x < $scope.CampaignData.length; x++) {
                        if ($scope.CampaignData[x].CampaignName.toUpperCase().replaceAll(" ", "_") == $scope.modSkillData.campaignName.toUpperCase().replaceAll(" ", "_")) {
                            $scope.SkillCampSel = $scope.CampaignData[x].CampaignName;
                            $scope.SkillCampId = $scope.CampaignData[x].CampaignNo;
                            $scope.modSkillData.campaignName = $scope.CampaignData[x].CampaignName;
                            $scope.modSkillData.campaignId = $scope.CampaignData[x].CampaignNo;
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    $scope.SkillCampSel = "";
                }
                $scope.showSpinner = false;

            },
            function (response) {
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
    }
    // var found = false;

    // for (var opt = 0; opt < $scope.statusOpt; opt++) {
    //     if ($scope.statusOpt[opt].name == $scope.modSkillData.Status) {
    //         $scope.statusOpt[opt].sel = 'selected';
    //     }
    // }

    $scope.DispSelected = function(){
        switch ($scope.modSkillData.acwTypeName){
            case "None":
                $scope.modSkillData.UseDispositions = false;
                $scope.modSkillData.acwTypeId = "1";
                break;
            case "Disp.":
                $scope.modSkillData.UseDispositions = true;
                $scope.modSkillData.acwTypeId = "2";
                break;
            case "Auto Wrap":
                $scope.modSkillData.UseDispositions = false;
                $scope.modSkillData.acwTypeId = "3";
                break;
        }
    };

    $scope.CampSelected = function(){
        for (var x = 0;x<$scope.CampaignData.length;x++){
            if($scope.CampaignData[x].CampaignName == $scope.SkillCampSel){
                $scope.modSkillData.CampaignName = $scope.SkillCampSel;
                $scope.modSkillData.CampaignId =  $scope.CampaignData[x].CampaignNo;
            }
        }
        ValidateElements();
        console.log($scope);
    };

    $scope.updateSkill = function () {
        $scope.showSpinner = true;
        var token = SOAPClient.ICToken;
        var extURL = 'services/v7.0/skills/' + $scope.modSkillData.skillId ;

        var updateSkill = [];
            updateSkill[0] = {
                acceleration:$scope.modSkillData.acceleration,
                acwTypeId:$scope.modSkillData.acwTypeId,
                agentRestTime:$scope.modSkillData.agentRestTime,
                agentless:$scope.modSkillData.agentless,
                agentlessPorts:$scope.modSkillData.agentlessPorts,
                allowSecondaryDisposition:$scope.modSkillData.allowSecondaryDisposition,
                callSuppressionScriptId:$scope.modSkillData.callSuppressionScriptId,
                callerIdOverride:$scope.modSkillData.callerIdOverride,
                campaignId:$scope.modSkillData.campaignId,
                campaignName:$scope.modSkillData.campaignName,
                countOtherAbandons:$scope.modSkillData.countOtherAbandons,
                countReskillHours:$scope.modSkillData.countReskillHours,
                countShortAbandons:$scope.modSkillData.countShortAbandons,
                displayThankyou:$scope.modSkillData.displayThankyou,
                emailBccAddress:$scope.modSkillData.emailBccAddress,
                emailFromAddress:$scope.modSkillData.emailFromAddress,
                emailFromEditable:$scope.modSkillData.emailFromEditable,
                emailParking:$scope.modSkillData.emailParking,
                enableShortAbandon:$scope.modSkillData.enableShortAbandon,
                initialPriority:$scope.modSkillData.initialPriority,
                interruptible:$scope.modSkillData.interruptible,
                isActive:$scope.modSkillData.isActive,
                isOutbound:$scope.modSkillData.isOutbound,
                isRunning:$scope.modSkillData.isRunning,
                makeTranscriptAvailable:$scope.modSkillData.makeTranscriptAvailable,
                maxPriority:$scope.modSkillData.maxPriority,
                maxSecondsACW:$scope.modSkillData.maxSecondsACW,
                mediaTypeId:$scope.modSkillData.mediaTypeId,
                mediaTypeName:$scope.modSkillData. mediaTypeName,
                minWorkingTime:$scope.modSkillData.minWorkingTime,
                notes:$scope.modSkillData.notes,
                outboundStrategy:$scope.modSkillData.outboundStrategy,
                popThankYou:$scope.modSkillData.popThankYou,
                popThankYouURL:$scope.modSkillData.popThankYouURL,
                priorityBlending:$scope.modSkillData.priorityBlending,
                requireDisposition:$scope.modSkillData.requireDisposition,
                reskillHours:$scope.modSkillData.reskillHours,
                reskillHoursName:$scope.modSkillData.reskillHoursName,
                screenPopDetail:$scope.modSkillData.screenPopDetail,
                screenPopTriggerEvent:$scope.modSkillData.screenPopTriggerEvent,
                scriptDisposition:$scope.modSkillData.scriptDisposition,
                scriptId:$scope.modSkillData.scriptId,
                scriptName:$scope.modSkillData.scriptName,
                serviceLevelGoal:$scope.modSkillData.serviceLevelGoal,
                serviceLevelThreshold:$scope.modSkillData.serviceLevelThreshold,
                shortAbandonThreshold:$scope.modSkillData.shortAbandonThreshold,
                skillId:$scope.modSkillData.skillId,
                skillName:$scope.modSkillData.skillName,
                stateIdACW:$scope.modSkillData.stateIdACW,
                stateNameACW:$scope.modSkillData.stateNameACW,
                thankYouLink:$scope.modSkillData.thankYouLink,
                transcriptFromAddress:$scope.modSkillData.transcriptFromAddress,
                useCustomScreenPops:$scope.modSkillData.useCustomScreenPops,
                useScreenPops:$scope.modSkillData.useScreenPops  };

        var pri_sum = 0;
        var check_sum = 0;
        if($scope.modSkillData.UseDispositions){
            var disps = [];
            var count = 0;


            for (var x = 0;x<$scope.AllDispositions.length;x++){
                if ($scope.AllDispositions[x].associated){
                    disps[count]= {'dispositionId' : $scope.AllDispositions[x].DispositionID,
                        'dispositionName' : $scope.AllDispositions[x].Description,
                        'priority' : $scope.AllDispositions[x].priority};
                    count++;
                    check_sum = check_sum + count;
                    pri_sum = pri_sum + parseInt($scope.AllDispositions[x].priority);
                }
            }
            updateSkill[0].dispositions = disps;

        }
        if(pri_sum != check_sum) {
            alert("Error:   Dispositions are not sequential!");
            $scope.showSpinner = false;
        }else{
            // ok to update
            var  upDateParm = {skills : updateSkill};
            icSOAPServices.ICPUT(token, extURL, upDateParm).then(
                function(data){
                    $scope.showSpinner = false;
                    $location.path("/skill");
                },
                function(response){
                    $scope.showSpinner = false;
                    alert("ERROR:" + JSON.stringify(response));
                }
            )
        }




// //        alert(JSON.stringify(parm));
//         icSOAPServices.icGet("Skill_Update", parm).then(
//             function (data) {
// //                    alert("Update Completed");
//                 $location.path("/skill");
//             },
//             function (response) {
//                 alert("failed" + JSON.stringify(response));
//             }
//         );
    };
    $scope.cancelSkillUpdate = function () {
        $location.path("/skill");
    };
}]);
app.controller('SkillAddCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
    $scope.showSpinner = false;
    $scope.buttonName = "ADD";
    $scope.modSkillData = {
        "SkillID": "xxxxx",
        "Description": "",
        "Status": "Active",
        "LongDescription": "",
        "Notes": ""
    };
    $scope.statusOpt = [
        {name: 'Active', sel: 'selected'},
        {name: 'InActive', sel: ''}
    ];
    /*       for (var opt = 0; opt < $scope.statusOpt; opt++) {
     if ($scope.statusOpt[opt].name == $scope.modSkillData.Status) {
     $scope.statusOpt[opt].sel = 'selected';
     }
     } */
    $scope.updateSkill = function () {
        if ($scope.modSkillData.Description.length > 0) {
            var parm = {
                Skill: {
                    "Description": $scope.modSkillData.Description,
                    "Status": $scope.modSkillData.Status,
                    "LongDescription": $scope.modSkillData.LongDescription,
                    "Notes": $scope.modSkillData.Notes
                }
            };
            if (parm.Skill.Notes == null) {
                parm.Skill.Notes = "";
            }
            if (parm.Skill.Description == null) {
                parm.Skill.Description = "";
            }
            if (parm.Skill.LongDescription == null) {
                parm.Skill.LongDescription = "";
            }
            icSOAPServices.icGet("Skill_Add", parm).then(
                function (data) {
                    //                       alert("Addition Completed");
                    $location.path("/Skill");
                },
                function (response) {
                    alert("failed" + JSON.stringify(response));
                }
            );
        } else {
            alert("Need to input Skill Description");
        }

    };
    $scope.cancelSkillUpdate = function () {
        $location.path("/Skill");
    };
}]);