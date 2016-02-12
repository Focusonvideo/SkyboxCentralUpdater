/**
 * Created by Chester on 2/4/16.
 */
'use strict';

var app = angular.module('SkyboxApp');
    app.controller('TeammodCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.buttonName = "UPDATE";
        $scope.modTeamData = SOAPClient.passData;
        $scope.statusOpt = [
            {name: 'Active', sel: ''},
            {name: 'InActive', sel: ''}
        ];
        for (var opt = 0; opt < $scope.statusOpt; opt++) {
            if ($scope.statusOpt[opt].name == $scope.modTeamData.Status) {
                $scope.statusOpt[opt].sel = 'selected';
            }
        }
        $scope.updateTeam = function () {
            var parm = {
                team: {
                    "TeamNo": $scope.modTeamData.TeamNo,
                    "TeamName": $scope.modTeamData.TeamName,
                    "Status": $scope.modTeamData.Status,
                    "Description": $scope.modTeamData.Description,
                    "Notes": $scope.modTeamData.Notes,
                    "MaxConcurrentChats": $scope.modTeamData.MaxConcurrentChats
                }
            };
            if (parm.team.Notes == null) {
                parm.team.Notes = "";
            }
            if (parm.team.Description == null) {
                parm.team.Description = "";
            }
            icSOAPServices.icGet("Team_Update", parm).then(
                function (data) {
//                    alert("Update Completed");
                    $location.path("/team");
                },
                function (response) {
                    alert("failed" + JSON.stringify(response));
                }
            );
        };
        $scope.cancelTeamUpdate = function () {
            $location.path("/team");
        };
    }]);
    app.controller('TeamaddCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.buttonName = "ADD";
        $scope.modTeamData = {
            "TeamNo": "xxxxx",
            "TeamName": "",
            "Status": "Active",
            "Description": "",
            "Notes": "",
            "MaxConcurrentChats": 0
        };
        $scope.statusOpt = [
            {name: 'Active', sel: 'selected'},
            {name: 'InActive', sel: ''}
        ];
 //       for (var opt = 0; opt < $scope.statusOpt; opt++) {
 //           if ($scope.statusOpt[opt].name == $scope.modTeamData.Status) {
 //               $scope.statusOpt[opt].sel = 'selected';
 //           }
 //       }
        $scope.updateTeam = function () {
            if ($scope.modTeamData.TeamName.length > 0) {
                var parm = {
                    team: {
                        "TeamName": $scope.modTeamData.TeamName,
                        "Status": $scope.modTeamData.Status,
                        "Description": $scope.modTeamData.Description,
                        "Notes": $scope.modTeamData.Notes,
                        "MaxConcurrentChats": $scope.modTeamData.MaxConcurrentChats
                    }
                };
                if (parm.team.Notes == null) {
                    parm.team.Notes = "";
                }
                if (parm.team.Description == null) {
                    parm.team.Description = "";
                }
                icSOAPServices.icGet("Team_Add", parm).then(
                    function (data) {
//                        alert("Addition Completed");
                        $location.path("/team");
                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                    }
                );
            } else {
                alert("Need to input Team Name");
            }

        };
        $scope.cancelTeamUpdate = function () {
            $location.path("/team");
        };
    }]);