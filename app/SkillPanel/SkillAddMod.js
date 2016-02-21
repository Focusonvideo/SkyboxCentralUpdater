/**
 * Created by Chester on 2/17/16. ok
 */
'use strict';

var app = angular.module('SkyboxApp');
app.controller('SkillModCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
    $scope.showSpinner = false;
    $scope.buttonName = "UPDATE";
    $scope.modSkillData = SOAPClient.passData;
    $scope.statusOpt = [
        {name: 'Active', sel: ''},
        {name: 'InActive', sel: ''}
    ];
    for (var opt = 0; opt < $scope.statusOpt; opt++) {
        if ($scope.statusOpt[opt].name == $scope.modSkillData.Status) {
            $scope.statusOpt[opt].sel = 'selected';
        }
    }
    $scope.updateSkill = function () {
        var parm = {
            Skill: {
                "SkillID": $scope.modSkillData.SkillID,
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
        icSOAPServices.icGet("Skill_Update", parm).then(
            function (data) {
//                    alert("Update Completed");
                $location.path("/Skill");
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