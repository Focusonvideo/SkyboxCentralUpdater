/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillDispCtrl', ['$scope', 'icSOAPServices', '$location',  function($scope, icSOAPServices, $location) {
        $scope.showSpinner = true;
        $scope.modSkillSelected = "";
        $scope.newAssociated = "";
        icSOAPServices.icGet("Skill_GetList").then(
            function(data){
                $scope.showSpinner = false;
                $scope.skills = data;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        icSOAPServices.icGet("Disposition_GetList").then(
            function(data){
                $scope.showSpinner = false;
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
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        $scope.skillSelected = function(){
            for(var i=0;i<$scope.SkillDispData.length;i++){
                $scope.SkillDispData[i].AssocChanged = false;
            }
                var parm = {"skillNo":$scope.modSkillSelected};
            $scope.showSpinner = true;
            icSOAPServices.icGet("SkillDisposition_GetList", parm).then(
                function(data){
                    $scope.showSpinner = false;
                    $scope.skilloutdata = data;
                    for(var i=0;i<$scope.SkillDispData.length;i++){
                        var found = false;
                        for(var x=0;x<data.length;x++){
                            if(data[x].DispositionID == $scope.SkillDispData[i].DispositionID){
                                found = true;
                                break;
                            }
                        }
                        if(found){
                            $scope.SkillDispData[i].Assoc = "Yes";
                            $scope.SkillDispData[i].yesnos[0].sel = 'selected';
                            $scope.SkillDispData[i].yesnos[1].sel = '';
                            $scope.SkillDispData[i].ListPriority = data[x].ListPriority;
                            $scope.SkillDispData[i].UseComments = data[x].UseComments;
                            $scope.SkillDispData[i].CommentsRequired = data[x].CommentsRequired;
                            $scope.SkillDispData[i].showit = true;
                            if(data[x].UseComments){
                                $scope.SkillDispData[i].useComm = "true";
                                $scope.SkillDispData[i].useSelected[0].sel = "selected";
                                $scope.SkillDispData[i].useSelected[1].sel = "";
                            }else{
                                $scope.SkillDispData[i].useComm = "false";
                                $scope.SkillDispData[i].useSelected[0].sel = "";
                                $scope.SkillDispData[i].useSelected[1].sel = "Selected";
                            }

                        }else{
                            $scope.SkillDispData[i].showit = false;
                            $scope.SkillDispData[i].useComm = "";
                            $scope.SkillDispData[i].Assoc = "No";
                            $scope.SkillDispData[i].yesnos[1].sel = 'selected';
                            $scope.SkillDispData[i].yesnos[0].sel = '';
                            $scope.SkillDispData[i].ListPriority = "";
                            $scope.SkillDispData[i].UseComments = "";
                            $scope.SkillDispData[i].CommentsRequired = "";
                            $scope.SkillDispData[i].useSelected[0].sel = "";
                            $scope.SkillDispData[i].useSelected[1].sel = "";
                        }
                    }

                },
                function(response){
                    $scope.showSpinner = false;
                    alert("BAD:" + JSON.stringify(response));
                }
            );
            console.log($scope);

        };
        $scope.priorityChanged = function(index){
            // priorities change
            $scope.SkillDispData[index].AssocChanged = true;

        };
        $scope.useComChanged = function(index){

        };
        $scope.reqComChanged = function(index){

        };
        $scope.AssocChanged = function(index){
            $scope.SkillDispData[index].AssocChanged = true;
           if($scope.SkillDispData[index].Assoc == "No"){
                // reset show
                $scope.SkillDispData[index].showit = false;
            }else{
                $scope.SkillDispData[index].showit = true;
            }
        };
        $scope.UpdateSkillDisp = function(){
            for (var x=0;x<$scope.SkillDispData.length;x++){
                if($scope.SkillDispData[x].AssocChanged){
                    if($scope.SkillDispData[x].Assoc == 'Yes'){
                        var parm = {teamNo:$scope.modTeamSelected,
                            outstateCode:$scope.SkillDispData[x].OutstateCode};
                        icSOAPServices.icGet("TeamOutstate_Add", parm).then(
                            function(data){ // good
                                alert("Good");
                            }, function(reponse){
                                alert("Failure");
                            });

                    }else{
                        parm = {teamNo:$scope.modTeamSelected,
                            outstateCode:$scope.OutstateData[x].OutstateCode};
                        icSOAPServices.icGet("TeamOutstate_Delete", parm).then(
                        function(data){ // good
                                alert("Good");
                            }, function(reponse){
                                alert("Failure - this change must be done in Central");
                            });
                    }
                }
            }
        }
    }]);