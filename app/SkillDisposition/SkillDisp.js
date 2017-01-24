/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillDispCtrl', ['$scope', 'icSOAPServices', '$location', '$filter',  function($scope, icSOAPServices, $location, $filter) {
        var typeId = "";
        var searchString = "";
        var OB = "";
        var filter = "&isActive=true";
        var skillIdx = 0;

        $scope.noDisp = true;
        $scope.SkillFilterSel = "ALL";
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
        $scope.skillStatus = [];
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
        $scope.showSpinner = true;
        $scope.modSkillSelected = "";
        $scope.newAssociated = "";
        $scope.showAddConfig = false;
        $scope.showUseConfig = false;
        var orderBy = $filter('orderBy');
        icSOAPServices.icGet("Disposition_GetList").then(
            function(data){
                // $scope.showSpinner = false;
                $scope.SkillDispData = data;
                for(var i=0;i<$scope.SkillDispData.length;i++){
                    $scope.SkillDispData[i].yesnos = [
                        {name:"Yes", sel:"selected"},
                        {name:"No", sel:""}
                    ];
                    $scope.SkillDispData[i].useSelected = [
                        {sel:""},
                        {sel:""}
                    ];
                    $scope.SkillDispData[i].idx = i;
                }
                getUnavailable();
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        console.log($scope);
        $scope.skillTypeSelected = function(){
            $scope.showSpinner = true;
            switch ($scope.SkillTypeSel) {
                case "Phone Call IB":{
                    typeId = 4;
                    //               searchString = "&searchString=" + '"' + "isOutbound" + '"' + ":false";
                    OB = false;
                    break;
                }
                case "Voice Mail":{
                    typeId = 5;
                    searchString = "";
                    break;
                }
                case "Chat":{
                    searchString = "";
                    typeId = 3;
                    break;
                }
                case "EMail":{
                     searchString = "";
                    typeId = 1;
                    break;
                }
                case "Phone Call OB":{
                    typeId = 4;
//                searchString = "&searchString=" + '"' + "isOutbound" + '"' + ":true";
                    OB = true;
                    break;
                }
            }
            var token = SOAPClient.ICToken;
            var extURL = 'services/v8.0/skills?orderBy=skillName&mediaTypeId=' + typeId + filter + searchString;
            //        alert(extURL);
            icSOAPServices.ICGET(token, extURL).then(
                function(data){
                    var orderedlist;
                    $scope.sk = data.data.skills;
                    //               orderedlist = orderBy(data.data.skills, "skillName", false);
                    orderedlist = data.data.skills;
                    $scope.SkillDataOrig = [];

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
        var getUnavailable = function() {
            icSOAPServices.icGet("Outstate_GetList").then(
                function (data) {
                    $scope.unavail = data;
                    $scope.showSpinner = false;
                    $scope.OutstateData = [];
                    var idx = 0;
                    for (var i = 0; i < data.length; i++) {
                        if ((data[i].IsACW) && (data[i].Status == "Active")){
                            $scope.OutstateData[idx] = data[i];
                            idx++;
                        }
                    }
                },
                function (response) {
                    $scope.showSpinner = false;
                    alert("BAD:" + JSON.stringify(response));
                }
            );
        };
        $scope.skillSelected = function(){
            for(var i=0;i<$scope.SkillDispData.length;i++){
                $scope.SkillDispData[i].AssocChanged = false;
            }
            $scope.SkillData = JSON.parse(JSON.stringify($scope.SkillDataOrig));
            for (var x=0;x<$scope.SkillData.length;x++){
                if($scope.modSkillSelected == $scope.SkillData[x].skillName){
                    skillIdx = x;
                }
            }
            var dispositions = [];
            dispositions = $scope.SkillData[skillIdx].dispositions;
            $scope.ACWDisposition = $scope.SkillData[skillIdx].ACWDisposition;
            $scope.ACWState = $scope.SkillData[skillIdx].stateNameACW;
            $scope.ACWMaxSec = $scope.SkillData[skillIdx].maxSecondsACW;
            $scope.requireDisposition = $scope.SkillData[skillIdx].requireDisposition;
            switch ($scope.SkillData[skillIdx].acwTypeId) {
                case 1: // None
                    $scope.showDisp = false;
                    $scope.showSeconds = false;
                    $scope.showState = false;
                    $scope.showReq = false;
                    break;
                case 2: // Disp
                    $scope.showDisp = true;
                    $scope.showSeconds = true;
                    $scope.showReq = true;
                    $scope.showState = true;
                    break;
                case 3: // Auto
                    $scope.showDisp = false;
                    $scope.showSeconds = true;
                    $scope.showReq = false;
                    $scope.showState = true;
                    break;
            }
              for(var i=0;i<$scope.SkillDispData.length;i++){
                var found = false;
                if (dispositions != undefined) {
                    for (var x = 0; x < dispositions.length; x++) {
                        if (dispositions[x].dispositionId == $scope.SkillDispData[i].DispositionID) {
                            found = true;
                            break;
                        }
                    }
                }
                if(found){
                    $scope.SkillDispData[i].Assoc = true;

                    $scope.SkillDispData[i].yesnos[0].sel = 'selected';
                    $scope.SkillDispData[i].yesnos[1].sel = '';
                    $scope.SkillDispData[i].ListPriority = dispositions[x].priority;
                    $scope.SkillDispData[i].SkillDispositionID = dispositions[x].dispositionId;
                    $scope.SkillDispData[i].showit = true;

                }else{
                    $scope.SkillDispData[i].showit = false;
                    $scope.SkillDispData[i].Assoc = false;
                    $scope.SkillDispData[i].yesnos[1].sel = 'selected';
                    $scope.SkillDispData[i].yesnos[0].sel = '';
                    $scope.SkillDispData[i].ListPriority = 0;
                    $scope.SkillDispData[i].useSelected[0].sel = "";
                    $scope.SkillDispData[i].useSelected[1].sel = "";
                }
            }
            console.log($scope);
            $scope.showAddConfig = true;

        };
        $scope.ACWTypeChanged = function(){

            switch ($scope.ACWDisposition) {
                case "None": // None
                    $scope.showDisp = false;
                    $scope.showSeconds = false;
                    $scope.showState = false;
                    $scope.showReq = false;
                    $scope.SkillData[skillIdx].acwTypeId = 1;
                    break;
                case "Disp.": // Disp
                    $scope.showDisp = true;
                    $scope.showSeconds = true;
                    $scope.showReq = true;
                    $scope.showState = true;
                    $scope.SkillData[skillIdx].acwTypeId = 2;
                    break;
                case "Auto Disp.": // Auto
                    $scope.showDisp = false;
                    $scope.showSeconds = true;
                    $scope.showReq = false;
                    $scope.showState = true;
                    $scope.SkillData[skillIdx].acwTypeId = 3;
                    break;
            }

        };
        $scope.ACWStateChanged = function(){
            $scope.SkillData[skillIdx].stateNameACW = $scope.ACWState;
            for (var i=0;i<$scope.OutstateData.length;i++){
                if ($scope.ACWState == $scope.OutstateData[i].Description){
                    $scope.SkillData[skillIdx].stateIdACW = $scope.OutstateData[i].OutstateCode;
                }
            }
        };
        $scope.ACWSecondsChanged = function(){
            $scope.SkillData[skillIdx].maxSecondsACW = $scope.ACWMaxSec;
        };
        $scope.ACWreqiredChanged = function(){
            $scope.SkillData[skillIdx].requireDisposition = $scope.requireDisposition;
        };

        $scope.priorityChanged = function(index){
            // priorities change
            $scope.SkillDispData[index].propertyChanged = true;

        };
        $scope.AssocChanged = function(index){
            $scope.SkillDispData[index].AssocChanged = true;
           if($scope.SkillDispData[index].Assoc == false){
                // reset show
                $scope.SkillDispData[index].showit = false;
               // remove from list priority
               var curPri = $scope.SkillDispData[index].ListPriority;
               $scope.SkillDispData[index].ListPriority = 0;
               for (var x=0;x < $scope.SkillDispData.length; x++) {
                   if ($scope.SkillDispData[x].ListPriority > curPri ) {
                       $scope.SkillDispData[x].ListPriority = $scope.SkillDispData[x].ListPriority - 1;
                   }
               }
           }else{
                $scope.SkillDispData[index].showit = true;
                // add to list priority
               //find current max priority this will be the next
               var maxPri = 0;
               for (var x=0;x < $scope.SkillDispData.length; x++) {
                   if ($scope.SkillDispData[x].ListPriority > maxPri ) {
                       maxPri = $scope.SkillDispData[x].ListPriority;
                   }
               }
               $scope.SkillDispData[index].ListPriority = maxPri + 1;
           }
        };
        $scope.SaveConfig = function(){
            $scope.savedDispDataConfig = new Array($scope.SkillDispData.length);
            for (var x=0;x < $scope.SkillDispData.length; x++) {
                $scope.savedDispDataConfig[x]= {
                                 ListPriority : $scope.SkillDispData[x].ListPriority,
                                       showit : $scope.SkillDispData[x].showit,
                                    useSelected:[{sel:$scope.SkillDispData[x].useSelected[0].sel},
                                                {sel:$scope.SkillDispData[x].useSelected[1].sel}],
                                         yesnos:[{name:$scope.SkillDispData[x].yesnos[0].name,
                                                  sel:$scope.SkillDispData[x].yesnos[0].sel},
                                                {name:$scope.SkillDispData[x].yesnos[1].name,
                                                  sel:$scope.SkillDispData[x].yesnos[1].sel}
                                        ]
                }

            }
            $scope.savedSkillData = {"acwTypeId": $scope.SkillData[skillIdx].acwTypeId,
                "stateIdACW":$scope.SkillData[skillIdx].stateIdACW,
                "maxSecondsACW":$scope.SkillData[skillIdx].maxSecondsACW,
                "requireDisposition":$scope.SkillData[skillIdx].requireDisposition,
                "ACWDisposition": $scope.ACWDisposition,
                "ACWMaxSec": $scope.ACWMaxSec,
                "ACWState": $scope.ACWState};

            $scope.showUseConfig = true;
        };
        $scope.UseConfig = function(){
            for (var x = 0; x < $scope.SkillDispData.length; x++) {
                $scope.SkillDispData[x].ListPriority = $scope.savedDispDataConfig[x].ListPriority;
                $scope.SkillDispData[x].useSelected[0].sel = $scope.savedDispDataConfig[x].useSelected[0].sel;
                $scope.SkillDispData[x].useSelected[1].sel = $scope.savedDispDataConfig[x].useSelected[1].sel;
                $scope.SkillDispData[x].yesnos[0].name = $scope.savedDispDataConfig[x].yesnos[0].name;
                $scope.SkillDispData[x].yesnos[0].sel = $scope.savedDispDataConfig[x].yesnos[0].sel;
                $scope.SkillDispData[x].yesnos[1].name = $scope.savedDispDataConfig[x].yesnos[1].name;
                $scope.SkillDispData[x].yesnos[1].sel = $scope.savedDispDataConfig[x].yesnos[1].sel;
                $scope.SkillDispData[x].showit = $scope.savedDispDataConfig[x].showit;
            }
            $scope.SkillData[skillIdx].requireDisposition = $scope.savedSkillData.requireDisposition;
            $scope.requireDisposition = $scope.savedSkillData.requireDisposition;
            $scope.SkillData[skillIdx].acwTypeId = $scope.savedSkillData.acwTypeId;
            $scope.ACWDisposition = $scope.savedSkillData.ACWDisposition;
            $scope.ACWState = $scope.savedSkillData.ACWState;
            $scope.SkillData[skillIdx].maxSecondsACW = $scope.savedSkillData.maxSecondsACW;
            $scope.SkillData[skillIdx].stateIdACW = $scope.savedSkillData.stateIdACW;
            $scope.ACWMaxSec = $scope.savedSkillData.ACWMaxSec;

            $scope.ACWTypeChanged();
        };
        $scope.UpdateSkillDisp = function() {
            if ($scope.SkillData[skillIdx].acwTypeId != 1) {
                if ($scope.SkillData[skillIdx].acwTypeId == 3) {
                    if ($scope.SkillData[skillIdx].stateIdACW == 0) {
                        alert("ACW State cannot be blank");
                        return;
                    }
                    if ($scope.SkillData[skillIdx].maxSecondsACW == 0) {
                        alert("Max ACW Sec. cannot be 0");
                        return;
                    }
                } else {
                    // type 2  Disp.
                    if (!$scope.SkillData[skillIdx].requireDisposition) {
                        if ($scope.SkillData[skillIdx].maxSecondsACW == 0) {
                            alert("Max ACW Sec. cannot be 0");
                            return;
                        }
                    }
                    if ($scope.SkillData[skillIdx].stateIdACW == 0) {
                        alert("ACW State cannot be blank");
                        return;
                    }
                    var f = false;
                    for (var x = 0; x < $scope.SkillDispData.length; x++) {
                        if ($scope.SkillDispData[x].ListPriority > 0) {
                            f = true;
                            break;
                        }
                    }
                    if (!f) {
                        alert("must have at least one disposition associated with this skill");
                        return;
                    }
                }

            }
            $scope.showSpinner = true;
            var oldDisp = [];
            var dispString = ""
            oldDisp = $scope.SkillDataOrig[skillIdx].dispositions;
            for (var x = 0; x < $scope.SkillDispData.length; x++) {
                if ($scope.SkillDispData[x].ListPriority > 0) {
                    // look for it in the old data
                    var foundit = false;
                    if (oldDisp != undefined) {
                        // look for old disposition
                        var found = false;
                        for (var w = 0; w < oldDisp.length; w++) {
                            if (oldDisp[w].dispositionId == $scope.SkillDispData[x].DispositionID) {
                                found = true;
                                if (oldDisp[w].priority != $scope.SkillDispData[x].ListPriority) {
                                    dispString = dispString + "{\"dispositionId\":\"" + $scope.SkillDispData[x].DispositionID + "\",";
                                    dispString = dispString + "\"priority\":\"" + $scope.SkillDispData[x].ListPriority + "\"},";
                                    break;
                                } else {
                                    // no change
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            // new item
                            dispString = dispString + "{\"dispositionId\":\"" + $scope.SkillDispData[x].DispositionID + "\",";
                            dispString = dispString + "\"priority\":\"" + $scope.SkillDispData[x].ListPriority + "\"},";
                        }
                    } else {
                        // there were no dispositions before. therefore, ADD
                        dispString = dispString + "{\"dispositionId\":\"" + $scope.SkillDispData[x].DispositionID + "\",";
                        dispString = dispString + "\"priority\":\"" + $scope.SkillDispData[x].ListPriority + "\"},";
                    }
                } else {
                    // not associated now - see if it was prior
                    if (oldDisp != undefined) {
                        // look for old disposition
                        var found = false;
                        for (var w = 0; w < oldDisp.length; w++) {
                            if (oldDisp[w].dispositionId == $scope.SkillDispData[x].DispositionID) {
                                if (oldDisp[w].priority != $scope.SkillDispData[x].ListPriority) {
                                    dispString = dispString + "{\"dispositionId\":\"" + $scope.SkillDispData[x].DispositionID + "\",";
                                    dispString = dispString + "\"priority\":\"" + $scope.SkillDispData[x].ListPriority + "\"},";
                                    break;
                                } else {
                                    // no change
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (dispString.length > 0) {
                dispString = dispString.substr(0, dispString.length - 1);
                dispString = "\"dispositions\":[" + dispString + "]";
                // dispString = "\"acwTypeId\":2,\"dispositions\":[" + dispString + "]";
                //               console.log(dispString);
            }
            var dispstr = "";
            if ($scope.SkillData[skillIdx].stateIdACW != $scope.SkillDataOrig[skillIdx].stateIdACW) {
                dispstr = dispstr + "\"stateIdACW\":" + $scope.SkillData[skillIdx].stateIdACW + ",";
            }
            if ($scope.SkillData[skillIdx].requireDisposition != $scope.SkillDataOrig[skillIdx].requireDisposition) {
                dispstr = dispstr + "\"requireDisposition\":" + $scope.SkillData[skillIdx].requireDisposition + ",";
            }
            if ($scope.SkillData[skillIdx].acwTypeId != $scope.SkillDataOrig[skillIdx].acwTypeId) {
                dispstr = dispstr + "\"acwTypeId\":" + $scope.SkillData[skillIdx].acwTypeId + ",";
            }
            if ($scope.SkillData[skillIdx].maxSecondsACW != $scope.SkillDataOrig[skillIdx].maxSecondsACW) {
                dispstr = dispstr + "\"maxSecondsACW\":" + $scope.SkillData[skillIdx].maxSecondsACW + ",";
            }
            if (dispstr.length > 0) {
                dispstr = "{\"skill\":{" + dispstr.substr(0, dispstr.length - 1);
                if (dispString.length > 0) {
                    dispstr = dispstr + "," + dispString + "}}";
                } else {
                    dispstr = dispstr + "}}";
                }
            } else {
                if (dispString.length > 0) {
                    dispstr = "{\"skill\":{" + dispString + "}}";
                }
            }
            if (dispstr.length > 0) {
                var updateJSON = JSON.parse(dispstr);
                console.log(JSON.stringify(updateJSON));
                console.log($scope.SkillData[skillIdx].skillId);
                var token = SOAPClient.ICToken;
                var extURL = 'services/v8.0/skills/';
                 icSOAPServices.ICPUT(token, extURL + $scope.SkillData[skillIdx].skillId, updateJSON).then(
                    function () {
                        $scope.showSpinner = false;
                        skillIdx++;
                        if (skillIdx <= $scope.SkillData.length){
                            $scope.modSkillSelected = $scope.SkillData[skillIdx].skillName;
                            $scope.skillSelected();
                        }



                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                        $scope.showSpinner = false;
                    }
                );
            } else {
                $scope.showSpinner = false;
            }
       };

        // pass 2 Add
         $scope.showSpinner = false;

    }]);