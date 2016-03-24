/**
 * Created by Chester on 2/17/16. ok
 */
'use strict';

var app = angular.module('SkyboxApp');
app.controller('SkillModCtrl', ['$scope', 'icSOAPServices', '$location', '$filter', function ($scope, icSOAPServices, $location, $filter) {
    $scope.showSpinner = false;
    $scope.buttonName = "UPDATE";
    var orderBy = $filter('orderBy')
    $scope.modSkillData = SOAPClient.passData;
    $scope.skillTypes = new Array(4);
    $scope.skillTypes[0] = {name : "Chat"};
    $scope.skillTypes[1] = {name : "PhoneCall"};
    $scope.skillTypes[2] = {name : "VoiceMail"};
    $scope.skillTypes[3] = {name : "EMail"};

    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find, 'g'), replace);
    };



    icSOAPServices.icGet("Campaign_GetList").then(
        function(data){
            var orderedlist = orderBy(data,"CampaignName",false);
            $scope.CampaignData = orderedlist;
            console.log($scope);
            if($scope.modSkillData.CampaignName != "") {
                for (var x = 0; x < $scope.CampaignData.length; x++) {
                    if ($scope.CampaignData[x].CampaignName.toUpperCase().replaceAll(" ", "_") == $scope.modSkillData.CampaignName.toUpperCase().replaceAll(" ", "_")) {
                        $scope.SkillCampSel = $scope.CampaignData[x].CampaignName;
                        $scope.SkillCampId = $scope.CampaignData[x].CampaignNo;
                        $scope.modSkillData.CampaignName = $scope.CampaignData[x].CampaignName;
                        $scope.modSkillData.CampaignId = $scope.CampaignData[x].CampaignNo;
                        found = true;
                        break;
                    }
                }
            }
            if (!found){
                $scope.SkillCampSel = "";
            }

        },
        function(response){
            $scope.showSpinner = false;
            alert("BAD:" + JSON.stringify(response));
        }
    );
    var found = false;

    $scope.statusOpt = [
        {name: 'Active', sel: ''},
        {name: 'InActive', sel: ''}
    ];
    for (var opt = 0; opt < $scope.statusOpt; opt++) {
        if ($scope.statusOpt[opt].name == $scope.modSkillData.Status) {
            $scope.statusOpt[opt].sel = 'selected';
        }
    }
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
        var parm = {
            skill: {
                "SkillNo": $scope.modSkillData.SkillNo,
                "SkillName": $scope.modSkillData.SkillName,
                "MediaType": $scope.modSkillData.MediaType,
                "Status": $scope.modSkillData.Status,
                "CampaignNo": $scope.modSkillData.CampaignNo,
                "OutboundSkill": $scope.modSkillData.OutboundSkill,
                "SLASeconds": $scope.modSkillData.SLASeconds,
                "SLAPercent": $scope.modSkillData.SLAPercent,
                "Notes": $scope.modSkillData.Notes,
                "Description": $scope.modSkillData.Description,
                "Interruptible": $scope.modSkillData.Interruptible,
                "FromEmailEditable": $scope.modSkillData.FromEmailEditable,
                "FromEmailAddress": $scope.modSkillData.FromEmailAddress ,
                "BccEmailAddress": $scope.modSkillData.BccEmailAddress,
                "UseDispositions": $scope.modSkillData.UseDispositions,
                "RequireDispositions": $scope.modSkillData.RequireDispositions,
                "DispositionTimer": $scope.modSkillData.DispositionTimer,
                "QueueInitPriority": $scope.modSkillData.QueueInitPriority,
                "QueueAcceleration": $scope.modSkillData.QueueAcceleration,
                "QueueFunction": $scope.modSkillData.QueueFunction,
                "QueueMaxPriority": $scope.modSkillData.QueueMaxPriority,
                "ActiveMinWorkTime": $scope.modSkillData.ActiveMinWorkTime,
                "OverrideCallerID": $scope.modSkillData.OverrideCallerID,
                "CallerIDNumber": $scope.modSkillData.CallerIDNumber,
                "UseScreenPops": $scope.modSkillData.UseScreenPops,
                "CustomScreenPopApp": $scope.modSkillData.CustomScreenPopApp,
                "CampaignName": $scope.modSkillData.CampaignName,
                "ShortAbandonThreshold": $scope.modSkillData.ShortAbandonThreshold,
                "UseShortAbandonThreshold": $scope.modSkillData.UseShortAbandonThreshold,
                "IncludeShortAbandons": $scope.modSkillData.IncludeShortAbandons,
                "IncludeOtherAbandons": $scope.modSkillData.IncludeOtherAbandons,
                "CustomScriptID": $scope.modSkillData.CustomScriptID,
                "CustomScriptName": $scope.modSkillData.CustomScriptName,
                "EnableBlending": $scope.modSkillData.EnableBlending

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


//        alert(JSON.stringify(parm));
        icSOAPServices.icGet("Skill_Update", parm).then(
            function (data) {
//                    alert("Update Completed");
                $location.path("/skill");
            },
            function (response) {
                alert("failed" + JSON.stringify(response));
            }
        );
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