/**
 * Created by Chester on 2/17/16. ok
 */
'use strict';

var app = angular.module('SkyboxApp');

app.controller('SkillBRDAddCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
    $scope.showSpinner = false;
    $scope.skillTypes = new Array(4);
    $scope.skillTypes[0] = {name : "Chat"};
    $scope.skillTypes[1] = {name : "PhoneCall"};
    $scope.skillTypes[2] = {name : "VoiceMail"};
    $scope.skillTypes[3] = {name : "EMail"};
    $scope.showTable = false;
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find, 'g'), replace);
    };
    function clearAll() {
        $scope.modSkillData = {
            SkillName: "",
            OutboundSkill: "",
            CallerIDNumber: "",
            CampaignName: "",
            SLASeconds: "",
            SLAPercent: "",
            UseShortAbandonThreshold: false,
            ShortAbandonThreshold: "",
            QueueInitPriority: "",
            QueueAcceleration: "",
            QueueMaxPriority: ""
        };
        $scope.SkillCampSel = "";
        $scope.disableAdd = true;
    }
    clearAll();
    icSOAPServices.icGet("Campaign_GetList").then(
        function(data){
            $scope.CampaignData = data;
        },
        function(response){
            $scope.showSpinner = false;
            alert("BAD:" + JSON.stringify(response));
        }
    );

     /*       for (var opt = 0; opt < $scope.statusOpt; opt++) {
     if ($scope.statusOpt[opt].name == $scope.modSkillData.Status) {
     $scope.statusOpt[opt].sel = 'selected';
     }
     } */
    $scope.AddBRDSkill = function () {
       var  parms4Add = CreateAddParms();
 //       alert(JSON.stringify(parms4Add));
       icSOAPServices.icGet("Skill_Add", parms4Add).then(
            function (data) {
                 $scope.SkipSkillBtn();
            },
            function (response) {
                alert("failed" + JSON.stringify(response));
            }
        );
    };
    $scope.cancelSkillUpdate = function () {
        $location.path("/skill");
    };
    function processSkillLine(SkillLine){
        var skillParsedCol = SkillLine.split(String.fromCharCode(9));
        $scope.modSkillData.SkillName = skillParsedCol[0];
        if($scope.ConvertIn2Out) {
            $scope.modSkillData.SkillName = skillParsedCol[0] + " OB";
        }
        switch ($scope.SkillTypeSel){
            case "PhoneCall":
                doDirection(skillParsedCol[2]);
                doCallerID(skillParsedCol[3]);
                doCampaign(skillParsedCol[4]);
                doSLA(skillParsedCol[5]);
                doShortAbandon(skillParsedCol[6]);
                doPriority(skillParsedCol[7]);
                break;
            case "VoiceMail":
                doDirection(skillParsedCol[2]);
                doCampaign(skillParsedCol[3]);
                doSLA(skillParsedCol[4]);
                doShortAbandon(skillParsedCol[5]);
                doPriority(skillParsedCol[6]);
                break;
            case "Chat":
                doCampaign(skillParsedCol[2]);
                doSLA(skillParsedCol[3]);
                doShortAbandon(skillParsedCol[4]);
                doPriority(skillParsedCol[5]);
                break;
            case "EMail":
                doDirection(skillParsedCol[2]);
                doCampaign(skillParsedCol[3]);
                doFromAddress(skillParsedCol[4]);
                doSLA(skillParsedCol[5]);
                doPriority(skillParsedCol[6]);
                break;

        }
        // validate key elements
        ValidateElements();
    }

    function ValidateElements(){
        if($scope.SkillCampSel != "" && $scope.modSkillData.SkillName != ""){
            $scope.disableAdd = false;
        }else{
            $scope.disableAdd = true;
        }
        if($scope.SkillTypeSel == "EMail"){
            if($scope.modSkillData.FromEmailAddress == ""){
                $scope.disableAdd = true;
            }
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

    function doFromAddress(myAddress){
        if(myAddress != ""){
            $scope.modSkillData.FromEmailAddress = myAddress;
        }else{
            $scope.modSkillData.FromEmailAddress = "";
        }
    }
    function doPriority(myPriority){
        if(myPriority != "") {
            var priorities = myPriority.replace("(","").replace(")","");
            var prio = priorities.split("|");
            if (prio.length == 3) {
                $scope.modSkillData.QueueInitPriority = prio[0];
                $scope.modSkillData.QueueAcceleration = prio[1];
                $scope.modSkillData.QueueMaxPriority = prio[2];
            }else{
                if(prio.length == 2){
                    $scope.modSkillData.QueueInitPriority = prio[0];
                    $scope.modSkillData.QueueAcceleration = prio[1];
                    $scope.modSkillData.QueueMaxPriority = "1000";
                }else{
                    $scope.modSkillData.QueueInitPriority = prio[0];
                    $scope.modSkillData.QueueAcceleration = "1";
                    $scope.modSkillData.QueueMaxPriority = "1000";
                }
            }
        }else {
            $scope.modSkillData.QueueInitPriority = "0";
            $scope.modSkillData.QueueAcceleration = "1";
            $scope.modSkillData.QueueMaxPriority = "1000";
        }
    }
    function doShortAbandon(myAbandons){
        if(myAbandons != "") {
            var ShortAbs = myAbandons.split(",");
            if (ShortAbs.length == 2) {
                if (ShortAbs[0].toUpperCase().trim() == "Y") {
                    $scope.modSkillData.UseShortAbandonThreshold = true;
                    $scope.modSkillData.ShortAbandonThreshold = ShortAbs[1].replace(" sec","");
                }else{
                    $scope.modSkillData.UseShortAbandonThreshold = false;
                    $scope.modSkillData.ShortAbandonThreshold = "";
                }
            }else{
                $scope.modSkillData.UseShortAbandonThreshold = true;
                $scope.modSkillData.ShortAbandonThreshold = "15";
            }
        }else {
            $scope.modSkillData.UseShortAbandonThreshold = true;
            $scope.modSkillData.ShortAbandonThreshold = "15";
        }
    }
    function doSLA(mySLA){
        if(mySLA != "") {
            var SLAs = mySLA.split("/");
            if (SLAs.length == 2) {
                $scope.modSkillData.SLASeconds = SLAs[0];
                $scope.modSkillData.SLAPercent = SLAs[1];
            }else{
                $scope.modSkillData.SLASeconds = "";
                $scope.modSkillData.SLAPercent = "";
            }
        }else {
            $scope.modSkillData.SLASeconds = "";
            $scope.modSkillData.SLAPercent = "";
        }
    }
    function doCampaign(myCampaign){
        var found = false;
        if(myCampaign != "") {
            for (var x = 0; x < $scope.CampaignData.length; x++) {
                if ($scope.CampaignData[x].CampaignName.toUpperCase().replaceAll(" ", "_") == myCampaign.toUpperCase().replaceAll(" ", "_")) {
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
    }
    function doCallerID(myCallerID){
        if($scope.modSkillData.OutboundSkill){
            $scope.modSkillData.CallerIDNumber = myCallerID.replaceAll("-","");
        }else{
            $scope.modSkillData.CallerIDNumber = "";
        }
    }
    function doDirection(myDirection){
        if (myDirection.toUpperCase() == "INBOUND") {
            $scope.modSkillData.OutboundSkill = false;
            $scope.showShortAbandon = true;
            $scope.showSLA = true;
            if($scope.ConvertIn2Out) {
                $scope.modSkillData.OutboundSkill = true;
                $scope.showShortAbandon = false;
                $scope.showSLA = false;
            }
        }else{
            $scope.modSkillData.OutboundSkill = true;
        }
    }


    $scope.SkillsDropped = function(){
        if($scope.massBRDInput != ""){
            var skillList = $scope.massBRDInput.split(String.fromCharCode(10));
            if (skillList.length > 0) {
                // get first skill off the top.
                var firstSkill = skillList[0];
                processSkillLine(firstSkill);
            }
        }
        console.log($scope);
    };
    $scope.SkipSkillBtn = function(){
        if($scope.massBRDInput != ""){
            var skillList = $scope.massBRDInput.split(String.fromCharCode(10));
            if (skillList.length > 0) {
                // remove first skill off the top.
                if(skillList.length == 1) {
                    $scope.massBRDInput = $scope.massBRDInput.replace(skillList[0], "");
                    clearAll();
                }else{
                    $scope.massBRDInput = $scope.massBRDInput.replace(skillList[0] + String.fromCharCode(10), "");
                }
                if($scope.massBRDInput != ""){
                    // more in list
                    processSkillLine(skillList[1]);
                }
            }
        }

    };
    $scope.skillTypeSelected = function(){
        $scope.showTable = true;
        $scope.modSkillData.MediaType = $scope.SkillTypeSel;
        switch ($scope.SkillTypeSel){
            case "PhoneCall":
                $scope.showDirection = true;
                $scope.showCallerID = true;
                $scope.showFromAddress = false;
                $scope.showShortAbandon = true;
                break;
            case "VoiceMail":
                $scope.showDirection = true;
                $scope.showCallerID = false;
                $scope.showFromAddress = false;
                $scope.showShortAbandon = true;
                break;
            case "Chat":
                $scope.showDirection = false;
                $scope.showCallerID = false;
                $scope.showFromAddress = false;
                $scope.showShortAbandon = true;
                break;
            case "EMail":
                $scope.showDirection = true;
                $scope.showCallerID = false;
                $scope.showFromAddress = true;
                $scope.showShortAbandon = false;
                break;

        }
    };
    function CreateAddParms(){
        var parm1 = {};
        switch ($scope.SkillTypeSel){
            case "PhoneCall":
                if($scope.modSkillData.OutboundSkill) {
                    if ($scope.modSkillData.CallerIDNumber != "") {
                        $scope.modSkillData.OverrideCallerID = true;
                    } else {
                        $scope.modSkillData.OverrideCallerID = false;
                    }
                    parm1 = {
                        skill: {
                            SkillName: $scope.modSkillData.SkillName,
                            MediaType: $scope.SkillTypeSel,
                            Status: "Active",
                            CampaignNo: $scope.modSkillData.CampaignId,
                            OutboundSkill: $scope.modSkillData.OutboundSkill,
                            QueueInitPriority: $scope.modSkillData.QueueInitPriority,
                            QueueAcceleration: $scope.modSkillData.QueueAcceleration,
                            QueueMaxPriority: $scope.modSkillData.QueueMaxPriority,
                            OverrideCallerID: $scope.modSkillData.OverrideCallerID,
                            CallerIDNumber: $scope.modSkillData.CallerIDNumber,
                            SLASeconds: 30,
                            SLAPercent: 90,
                            CampaignName: $scope.modSkillData.CampaignName
                        }
                    };
                }else{  // Inbound
                    parm1 = {
                        skill: {
                            SkillName: $scope.modSkillData.SkillName,
                            MediaType: $scope.SkillTypeSel,
                            Status: "Active",
                            CampaignNo: $scope.modSkillData.CampaignId,
                            OutboundSkill: $scope.modSkillData.OutboundSkill,
                            SLASeconds: $scope.modSkillData.SLASeconds,
                            SLAPercent: $scope.modSkillData.SLAPercent,
                            QueueInitPriority: $scope.modSkillData.QueueInitPriority,
                            QueueAcceleration: $scope.modSkillData.QueueAcceleration,
                            QueueMaxPriority: $scope.modSkillData.QueueMaxPriority,
                            CampaignName: $scope.modSkillData.CampaignName,
                            ShortAbandonThreshold: $scope.modSkillData.ShortAbandonThreshold,
                            UseShortAbandonThreshold: $scope.modSkillData.UseShortAbandonThreshold
                        }
                    };
                }
                break;
            case "Chat":
                 parm1 = {skill:{
                    SkillName : $scope.modSkillData.SkillName,
                    MediaType : $scope.SkillTypeSel,
                    Status : "Active",
                    CampaignNo : $scope.modSkillData.CampaignId,
                    SLASeconds : $scope.modSkillData.SLASeconds,
                    SLAPercent : $scope.modSkillData.SLAPercent,
                    QueueInitPriority : $scope.modSkillData.QueueInitPriority,
                    QueueAcceleration : $scope.modSkillData.QueueAcceleration,
                    QueueMaxPriority : $scope.modSkillData.QueueMaxPriority,
                    CampaignName : $scope.modSkillData.CampaignName,
                    ShortAbandonThreshold : $scope.modSkillData.ShortAbandonThreshold,
                    UseShortAbandonThreshold : $scope.modSkillData.UseShortAbandonThreshold
                }};
                break;
            case "VoiceMail":
               parm1 = {skill:{
                    SkillName : $scope.modSkillData.SkillName,
                    MediaType : $scope.SkillTypeSel,
                    Status : "Active",
                    CampaignNo : $scope.modSkillData.CampaignId,
                    OutboundSkill : $scope.modSkillData.OutboundSkill,
                    SLASeconds : $scope.modSkillData.SLASeconds,
                    SLAPercent : $scope.modSkillData.SLAPercent,
                    QueueInitPriority : $scope.modSkillData.QueueInitPriority,
                    QueueAcceleration : $scope.modSkillData.QueueAcceleration,
                    QueueMaxPriority : $scope.modSkillData.QueueMaxPriority,
                    CampaignName : $scope.modSkillData.CampaignName,
                    ShortAbandonThreshold : $scope.modSkillData.ShortAbandonThreshold,
                    UseShortAbandonThreshold : $scope.modSkillData.UseShortAbandonThreshold
                }};
                break;
            case "EMail":
                parm1 = {skill:{
                    SkillName : $scope.modSkillData.SkillName,
                    MediaType : $scope.SkillTypeSel,
                    Status : "Active",
                    CampaignNo : $scope.modSkillData.CampaignId,
                    OutboundSkill : $scope.modSkillData.OutboundSkill,
                    SLASeconds : $scope.modSkillData.SLASeconds,
                    SLAPercent : $scope.modSkillData.SLAPercent,
                    FromEmailAddress : $scope.modSkillData.FromEmailAddress,
                    QueueInitPriority : $scope.modSkillData.QueueInitPriority,
                    QueueAcceleration : $scope.modSkillData.QueueAcceleration,
                    QueueMaxPriority : $scope.modSkillData.QueueMaxPriority,
                    CampaignName : $scope.modSkillData.CampaignName
                }};
                break;
        }
        return parm1;
    }
}]);