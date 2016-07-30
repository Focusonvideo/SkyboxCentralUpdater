/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('TeamOutstateCtrl', ['$scope', 'icSOAPServices', '$location',  function($scope, icSOAPServices, $location) {
        $scope.showSpinner = true;
        $scope.modTeamSelected = "";
        $scope.newAssociated = "";
        $scope.showUse = false;
        $scope.showSave = false;
        icSOAPServices.icGet("Team_GetList").then(
            function(data){
                $scope.showSpinner = false;
                $scope.teams = data;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        icSOAPServices.icGet("Outstate_GetList").then(
            function(data){
                $scope.showSpinner = false;
                $scope.OutstateData = data;
                for(var i=0;i<$scope.OutstateData.length;i++){
                    $scope.OutstateData[i].yesnos = [
                        {name:"Yes", sel:"selected"},
                        {name:"No", sel:""}
                    ];
                    $scope.OutstateData[i].idx = i;
//                    $scope.OutStateData[i].changed = false;
                }
//                alert("There is no current removal function once an association is made it cannot get removed via this Application. Changes must be done in Central to remove existing associations")
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        $scope.teamSelected = function(){
            for(var i=0;i<$scope.OutstateData.length;i++){
                $scope.OutstateData[i].AssocChanged = false;
            }
                var parm = {"teamNo":$scope.modTeamSelected};
            $scope.showSpinner = true;
            icSOAPServices.icGet("TeamOutstate_GetList", parm).then(
                function(data){
                    $scope.showSpinner = false;
                    $scope.teamoutdata = data;
                    for(var i=0;i<$scope.OutstateData.length;i++){
                        var found = false;
                        for(var x=0;x<data.length;x++){
                            if(data[x].OutstateCode == $scope.OutstateData[i].OutstateCode){
                                found = true;
                                break;
                            }
                        }
                        if(found){
                            $scope.OutstateData[i].Assoc = "Yes";
                            $scope.OutstateData[i].yesnos[0].sel = 'selected';
                            $scope.OutstateData[i].yesnos[1].sel = '';
                        }else{
                            $scope.OutstateData[i].Assoc = "No";
                            $scope.OutstateData[i].yesnos[1].sel = 'selected';
                            $scope.OutstateData[i].yesnos[0].sel = '';
                        }
                    }
                    $scope.showSave = true;
                },
                function(response){
                    $scope.showSpinner = false;
                    alert("BAD:" + JSON.stringify(response));
                }
            );
            console.log($scope);

        };
        $scope.AddOutstate = function(){
            $location.path("/outstateadd");
        };
        $scope.AssocChanged = function(index){
            if($scope.OutstateData[index].Assoc == "No"){
                for (var x = 0; x < $scope.teamoutdata.length; x++) {
                    if ($scope.teamoutdata[x].OutstateCode == $scope.OutstateData[index].OutstateCode) {
                        // there is no removal - need to be donein central
//                        alert("This action cannot be done via this interface.  Removal association needs to be done in Central.");
//                        $scope.OutstateData[index].Assoc = "Yes";
                        break;
                    }

                }
            }
            $scope.OutstateData[index].AssocChanged = true;
        };
        $scope.SaveTeamOutstate =function(){
             $scope.savedTO = new Array($scope.OutstateData.length) ;
            for (var x=0;x<$scope.OutstateData.length;x++){
                $scope.savedTO[x]= {Assoc : $scope.OutstateData[x].Assoc,
                yesnos : [{sel : $scope.OutstateData[x].yesnos[0].sel},
                    {sel : $scope.OutstateData[x].yesnos[1].sel}]};
            }
            $scope.showUse = true;
        };
        $scope.UseTeamOutstate =function(){
            for (var x=0;x<$scope.OutstateData.length;x++) {
                $scope.OutstateData[x].Assoc = $scope.savedTO[x].Assoc;
                $scope.OutstateData[x].yesnos[0].sel = $scope.savedTO[x].yesnos[0].sel;
                $scope.OutstateData[x].yesnos[1].sel = $scope.savedTO[x].yesnos[1].sel;
            }
       };
        $scope.UpdateTeamOutstate = function() {
            $scope.showSpinner = true;
            for (var i = 0; i < $scope.OutstateData.length; i++) {
                var found = false;
                for (var x = 0; x < $scope.teamoutdata.length; x++) {
                    if ($scope.teamoutdata[x].OutstateCode == $scope.OutstateData[i].OutstateCode) {
                        // there was a change - indicate
                        found = true;
                        break;
                    }
                }
                if (found) {
                    if ($scope.OutstateData[i].Assoc == "Yes") {
                        // no change from original
                        $scope.OutstateData[i].AssocChanged = false;
                    } else {
                        // was a change
                        $scope.OutstateData[i].AssocChanged = true;
                    }
                } else {
                    if ($scope.OutstateData[i].Assoc == "Yes") {
                        // no change from original
                        $scope.OutstateData[i].AssocChanged = true;
                    } else {
                        // was a change
                        $scope.OutstateData[i].AssocChanged = false;
                    }
                }
            }
            processList();
        };



        var processList = function(){
            for (var x=0;x<$scope.OutstateData.length;x++){
                var found = false;
                if($scope.OutstateData[x].AssocChanged){
                    if($scope.OutstateData[x].Assoc == 'Yes'){
                        $scope.OutstateData[x].AssocChanged = false;
 //                       soapAdd(x);
                        alert("add index:" + x);
                        break;
                    }else{
                        $scope.OutstateData[x].AssocChanged = false;
                        //soapDelete(x);
                        alert("Delete index:" + x);
                        break
 //                       alert("Cannot remove this association. (" + $scope.OutstateData[x].Description + ") Need to be removed in Central. Skipping Update");
 //                       $scope.OutstateData[x].Assoc = "Yes";
                    }
                }
            }
            if(!found){
                $scope.showSpinner = false;
            }
        };
        var soapAdd = function(index){
            var parm = {teamNo:$scope.modTeamSelected,
                outstateCode:$scope.OutstateData[index].OutstateCode};
            icSOAPServices.icGet("TeamOutstate_Add", parm).then(
                function(data){ // good
                    processList();
                }, function(reponse){
                    alert("Failure");
                });

        };
        var soapDelete = function(index){
            var parm = {teamNo:$scope.modTeamSelected,
                outstateCode:$scope.OutstateData[index].OutstateCode};
            icSOAPServices.icGet("TeamOutstate_Delete", parm).then(
                function(data){ // good
                    processList();
                }, function(reponse){
                    alert("Failure - this change must be done in Central");
                    processList();
                });

        }
    }]);