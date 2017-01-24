/**
 * Created by Chester on 2/17/16. ok
 */
'use strict';

var app = angular.module('SkyboxApp');

app.controller('SkillBRDAddCtrl', ['$scope', 'icSOAPServices', '$location', '$filter', function ($scope, icSOAPServices, $location, $filter) {
    var orderBy = $filter('orderBy');
    $scope.showSpinner = false;
    $scope.skillTypes = new Array(4);
    $scope.skillTypes[0] = {name : "Chat"};
    $scope.skillTypes[1] = {name : "PhoneCall"};
    $scope.skillTypes[2] = {name : "VoiceMail"};
    $scope.skillTypes[3] = {name : "EMail"};
    $scope.showTable = false;
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
//        return str.replace(new RegExp(find, 'g'), replace);
        return str.split(find).join(replace);
    };
    function clearAll() {
        $scope.modSkillData = {
            skillName: "",
            isOutbound: "",
            callerIdOverride: "",
            campaignName: "",
            serviceLevelThreshold: "",
            serviceLevelGoal: "",
            enableShortAbandon: false,
            shortAbandonThreshold: "",
            initialPriority: "",
            acceleration: "",
            maxPriority: ""
        };
        $scope.SkillCampSel = "";
        $scope.disableAdd = true;
    }
    clearAll();

    function parseBool(val) { return val === true || val === "True" }

    var token = SOAPClient.ICToken;
    var extURL = 'services/v7.0/campaigns';
    icSOAPServices.ICGET(token,extURL).then(
        function(data){
            var orderedlist;

//                alert(JSON.stringify(data));
            orderedlist = orderBy(data.data.resultSet.campaigns, "campaignName", false);
            $scope.NewCampData = orderedlist;
            for (var x =0;x<data.data.resultSet.campaigns.length;x++){
                $scope.NewCampData[x].index = x;
                $scope.NewCampData[x].isActive = parseBool($scope.NewCampData[x].isActive);
            }
            console.log($scope);
        },
        function(response){
            alert("BAD:" + JSON.stringify(response));
        }
    );



    // icSOAPServices.icGet("Campaign_GetList").then(
    //     function(data){
    //         $scope.CampaignData = data;
    //     },
    //     function(response){
    //         $scope.showSpinner = false;
    //         alert("BAD:" + JSON.stringify(response));
    //     }
    // );

     /*       for (var opt = 0; opt < $scope.statusOpt; opt++) {
     if ($scope.statusOpt[opt].name == $scope.modSkillData.Status) {
     $scope.statusOpt[opt].sel = 'selected';
     }
     } */
    $scope.AddBRDSkill = function () {
       var  parms4Add = CreateAddParms();
 //       alert(JSON.stringify(parms4Add));
       icSOAPServices.ICPOST(token,"services/v8.0/skills", parms4Add).then(
            function (data) {
 //               alert(JSON.stringify(data));
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
        $scope.modSkillData.skillName = skillParsedCol[0].trim();
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
        if($scope.SkillCampSel != "" && $scope.modSkillData.skillName != ""){
            $scope.disableAdd = false;
        }else{
            $scope.disableAdd = true;
        }
        if($scope.SkillTypeSel == "EMail"){
            if($scope.modSkillData.emailFromAddress == ""){
                $scope.disableAdd = true;
            }
        }

    }


    $scope.CampSelected = function(){
        for (var x = 0;x<$scope.NewCampData.length;x++){
            if($scope.NewCampData[x].campaignName == $scope.SkillCampSel){
                $scope.modSkillData.campaignName = $scope.SkillCampSel;
                $scope.modSkillData.campaignId =  $scope.NewCampData[x].campaignId;
            }
        }
        ValidateElements();
        console.log($scope);
    };

    function doFromAddress(myAddress){
        if(myAddress != ""){
            $scope.modSkillData.emailfromAddress = myAddress;
        }else{
            $scope.modSkillData.emailfromAddress = "";
        }
    }
    function doPriority(myPriority){
        if(myPriority != "") {
            var priorities = myPriority.replace("(","").replace(")","");
            var prio = priorities.split("|");
            if (prio.length == 3) {
                $scope.modSkillData.initialPriority = prio[0];
                $scope.modSkillData.acceleration = prio[1];
                $scope.modSkillData.maxPriority = prio[2];
            }else{
                if(prio.length == 2){
                    $scope.modSkillData.initialPriority = prio[0];
                    $scope.modSkillData.acceleration = prio[1];
                    $scope.modSkillData.vaxPriority = "1000";
                }else{
                    $scope.modSkillData.initialPriority = prio[0];
                    $scope.modSkillData.acceleration = "1";
                    $scope.modSkillData.maxPriority = "1000";
                }
            }
        }else {
            $scope.modSkillData.initialPriority = "0";
            $scope.modSkillData.acceleration = "1";
            $scope.modSkillData.maxPriority = "1000";
        }
    }
    function doShortAbandon(myAbandons){
        if(myAbandons != "") {
            var ShortAbs = myAbandons.split(",");
            if (ShortAbs.length == 2) {
                if (ShortAbs[0].toUpperCase().trim() == "Y") {
                    $scope.modSkillData.enableShortAbandon = true;
                    $scope.modSkillData.shortAbandonThreshold = ShortAbs[1].replace(" sec","");
                }else{
                    $scope.modSkillData.enableShortAbandon = false;
                    $scope.modSkillData.shortAbandonThreshold = ShortAbs[1].replace(" sec","");
                }
            }else{
                if (ShortAbs[0].toUpperCase().trim() == "Y") {
                    $scope.modSkillData.enableShortAbandon = true;
                    $scope.modSkillData.shortAbandonThreshold = "15";
                }else{
                    $scope.modSkillData.enableShortAbandon = false;
                    $scope.modSkillData.shortAbandonThreshold = "15";
                }
            }
        }else {
            $scope.modSkillData.enableShortAbandon = false;
            $scope.modSkillData.shortAbandonThreshold = "15";
        }
        var testval = Number($scope.modSkillData.shortAbandonThreshold);
        if ( testval !==  testval) {
            $scope.modSkillData.shortAbandonThreshold = "15";
        }
    }
    function doSLA(mySLA){
        if(mySLA != "") {
            var SLAs = mySLA.split("/");
            if (SLAs.length == 2) {
                $scope.modSkillData.serviceLevelThreshold = SLAs[0];
                $scope.modSkillData.serviceLevelGoal = SLAs[1];
            }else{
                $scope.modSkillData.serviceLevelThreshold = "30";
                $scope.modSkillData.serviceLevelGoal = "90";
            }
        }else {
            $scope.modSkillData.serviceLevelThreshold = "30";
            $scope.modSkillData.serviceLevelGoal = "90";
        }
    }
    function doCampaign(myCampaign){
        var found = false;
        if(myCampaign != "") {
            for (var x = 0; x < $scope.NewCampData.length; x++) {
                if ($scope.NewCampData[x].campaignName.toUpperCase().replaceAll(" ", "_") == myCampaign.toUpperCase().replaceAll(" ", "_")) {
                    $scope.SkillCampSel = $scope.NewCampData[x].campaignName;
                    $scope.SkillCampId = $scope.NewCampData[x].campaignId;
                    $scope.modSkillData.campaignName = $scope.NewCampData[x].campaignName;
                    $scope.modSkillData.campaignId = $scope.NewCampData[x].campaignId;
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
        if($scope.modSkillData.isOutbound){
            $scope.modSkillData.callerIdOverride = myCallerID.replaceAll("-","");
            $scope.modSkillData.callerIdOverride = $scope.modSkillData.callerIdOverride.replaceAll("(","");
            $scope.modSkillData.callerIdOverride = $scope.modSkillData.callerIdOverride.replaceAll(")","");
            $scope.modSkillData.callerIdOverride = $scope.modSkillData.callerIdOverride.replaceAll(" ","");
            if ($scope.modSkillData.callerIdOverride != ""){
                $scope.modSkillData.OverrideCallerID = true;
            }else{
                $scope.modSkillData.OverrideCallerID = false;
            }

        }else{
            $scope.modSkillData.callerIdOverride = "";
            $scope.modSkillData.OverrideCallerID = false;
        }
    }
    function doDirection(myDirection){
        if (myDirection.toUpperCase() == "INBOUND") {
            $scope.modSkillData.isOutbound = false;
            $scope.showShortAbandon = true;
            $scope.showSLA = true;
            if($scope.ConvertIn2Out) {
                $scope.modSkillData.isOutbound = true;
                $scope.showShortAbandon = false;
                $scope.showSLA = false;
            }
        }else{
            $scope.modSkillData.isOutbound = true;
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
        if($scope.massBRDInput != "" || $scope.massBRDInput != null){
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
        }else{
            clearAll();
        }

    };
    $scope.skillTypeSelected = function(){
        $scope.showTable = true;
        $scope.modSkillData.mediaTypeName = $scope.SkillTypeSel;
        switch ($scope.SkillTypeSel){
            case "PhoneCall":
                $scope.showDirection = true;
                $scope.showCallerID = true;
                $scope.showFromAddress = false;
                $scope.showShortAbandon = true;
                $scope.showSLA = true;
                break;
            case "VoiceMail":
                $scope.showDirection = true;
                $scope.showCallerID = false;
                $scope.showFromAddress = false;
                $scope.showShortAbandon = true;
                $scope.showSLA = false;
                break;
            case "Chat":
                $scope.showDirection = false;
                $scope.showCallerID = false;
                $scope.showFromAddress = false;
                $scope.showShortAbandon = true;
                $scope.showSLA = true;
                break;
            case "EMail":
                $scope.showDirection = true;
                $scope.showCallerID = false;
                $scope.showFromAddress = true;
                $scope.showShortAbandon = false;
                $scope.showSLA = false;
                break;

        }
    };
    function CreateAddParms(){
        var parm1 = {};
        switch ($scope.SkillTypeSel){
            case "PhoneCall":
                if($scope.modSkillData.isOutbound) {
                    if ($scope.modSkillData.callerIdOverride != "") {
                        $scope.modSkillData.OverrideCallerID = true;
                    } else {
                        $scope.modSkillData.OverrideCallerID = false;
                    }
                    parm1 = {
                        skills: [{
                            skillName: $scope.modSkillData.skillName,
//                            mediaTypeName: $scope.SkillTypeSel,
                            mediaTypeId: 4,
                            isActive: true,
                            campaignId: $scope.modSkillData.campaignId,
                            isOutbound: true,
                            initialPriority: $scope.modSkillData.initialPriority,
                            acceleration: $scope.modSkillData.acceleration,
                            maxPriority: $scope.modSkillData.maxPriority,
                            // OverrideCallerID: $scope.modSkillData.OverrideCallerID,
                            callerIdOverride: $scope.modSkillData.callerIdOverride,
                            serviceLevelThreshold: 30,
                            serviceLevelGoal: 90,
                            campaignName: $scope.modSkillData.campaignName
                        }]
                    };
                }else{  // Inbound
                    parm1 = {
                        skills: [{
                            skillName: $scope.modSkillData.skillName,
//                            mediaTypeName: $scope.SkillTypeSel,
                            mediaTypeId: 4,
                            isActive: true,
                            campaignId: $scope.modSkillData.campaignId,
                            isOutbound:false,
                            serviceLevelThreshold: $scope.modSkillData.serviceLevelThreshold,
                            serviceLevelGoal: $scope.modSkillData.serviceLevelGoal,
                            initialPriority: $scope.modSkillData.initialPriority,
                            acceleration: $scope.modSkillData.acceleration,
                            maxPriority: $scope.modSkillData.maxPriority,
                            CampaignName: $scope.modSkillData.CampaignName,
                            shortAbandonThreshold: $scope.modSkillData.shortAbandonThreshold,
                            enableShortAbandon: $scope.modSkillData.enableShortAbandon
                        }]
                    };
                }
                break;
            case "Chat":
                 parm1 = {skills:[{
                     skillName: $scope.modSkillData.skillName,
//                     mediaTypeName: $scope.SkillTypeSel,
                     mediaTypeId: 3,
                     isActive: true,
                     campaignId: $scope.modSkillData.campaignId,
                     serviceLevelThreshold: $scope.modSkillData.serviceLevelThreshold,
                     serviceLevelGoal: $scope.modSkillData.serviceLevelGoal,
                     initialPriority: $scope.modSkillData.initialPriority,
                     acceleration: $scope.modSkillData.acceleration,
                     maxPriority: $scope.modSkillData.maxPriority,
                     CampaignName: $scope.modSkillData.CampaignName,
                     shortAbandonThreshold: $scope.modSkillData.shortAbandonThreshold,
                     enableShortAbandon: $scope.modSkillData.enableShortAbandon
                }]};
                break;
            case "VoiceMail":
               parm1 = {skills:[{
                   skillName: $scope.modSkillData.skillName,
//                   mediaTypeName: $scope.SkillTypeSel,
                   mediaTypeId: 5,
                   isActive: true,
                   campaignId: $scope.modSkillData.campaignId,
                   isOutbound: $scope.modSkillData.isOutbound,
                   serviceLevelThreshold: $scope.modSkillData.serviceLevelThreshold,
                   serviceLevelGoal: $scope.modSkillData.serviceLevelGoal,
                   initialPriority: $scope.modSkillData.initialPriority,
                   acceleration: $scope.modSkillData.acceleration,
                   maxPriority: $scope.modSkillData.maxPriority,
                   CampaignName: $scope.modSkillData.CampaignName,
                   shortAbandonThreshold: $scope.modSkillData.shortAbandonThreshold,
                   enableShortAbandon: $scope.modSkillData.enableShortAbandon
                }]};
                break;
            case "EMail":
                parm1 = {skills:[{
                    skillName: $scope.modSkillData.skillName,
                    mediaTypeName: $scope.SkillTypeSel,
                    mediaTypeId: 1,
                    isActive: true,
                    campaignId: $scope.modSkillData.campaignId,
                    isOutbound: $scope.modSkillData.isOutbound,
                    serviceLevelThreshold: $scope.modSkillData.serviceLevelThreshold,
                    serviceLevelGoal: $scope.modSkillData.serviceLevelGoal,
                    emailFromAddress : $scope.modSkillData.emailFromAddress,
                    initialPriority: $scope.modSkillData.initialPriority,
                    acceleration: $scope.modSkillData.acceleration,
                    maxPriority: $scope.modSkillData.maxPriority,
                    CampaignName: $scope.modSkillData.CampaignName
                }]};
                break;
        }
        return parm1;
    }
}]);