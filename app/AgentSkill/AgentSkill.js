/**
 * Created by Chester on 1/28/2017.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('AgentSkillCtrl', ['$scope', 'icSOAPServices', '$location', '$filter',  function($scope, icSOAPServices, $location, $filter) {
        var filter = "&isActive=true";
        var skillIdx = 0;

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
        var extURL = 'services/v8.0/skills?orderBy=skillName';

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
        console.log($scope);
        var getAgents = function() {
 //           extURL = 'services/v8.0/agents?orderBy=lastName,teamName';
            extURL = 'services/v8.0/agents?orderBy=lastName';
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