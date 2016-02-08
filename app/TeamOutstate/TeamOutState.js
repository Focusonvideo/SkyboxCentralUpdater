/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('TeamOutstateCtrl', ['$scope', 'icSOAPServices', '$location',  function($scope, icSOAPServices, $location) {
        $scope.showSpinner = true;
        $scope.modTeamSelected = "";
        $scope.newAssociated = "";
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
            $scope.OutstateData[index].AssocChanged = true;
        };
        $scope.UpdateTeamOutstate = function(){
            for (var x=0;x<$scope.OutstateData.length;x++){
                if($scope.OutstateData[x].AssocChanged){
                    if($scope.OutstateData[x].Assoc == 'Yes'){
                        var parm = {teamNo:$scope.modTeamSelected,
                            outstateCode:$scope.OutstateData[x].OutstateCode};
                        alert(JSON.stringify(parm));
                        icSOAPServices.icGet("TeamOutstate_Add", parm).then(
                            function(data){ // good
                                alert("Good");
                            }, function(reponse){
                                alert("Failure");
                            });

                    }else{
                        var parm = {teamNo:$scope.modTeamSelected,
                            outstateCode:$scope.OutstateData[x].OutstateCode};
                        alert(JSON.stringify(parm));
                        icSOAPServices.icGet("TeamOutstate_Delete", parm).then(
                        function(data){ // good
                                alert("Good");
                            }, function(reponse){
                                alert("Failure");
                            });
                    }
                }
            }
        }
    }]);