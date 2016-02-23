/**
 * Created by Chester on 2/4/16.
 */
'use strict';

var app = angular.module('SkyboxApp');
    app.controller('OutstatemodCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.buttonName = "UPDATE";
        $scope.modOutstateData = SOAPClient.passData;
        $scope.statusOpt = [
            {name: 'Active', sel: ''},
            {name: 'InActive', sel: ''}
        ];
        $scope.IsACWOpt = [
            {name: "true", sel: ''},
            {name: "false", sel: ''}
        ];
        for (var opt = 0; opt < $scope.statusOpt; opt++) {
            if ($scope.statusOpt[opt].name == $scope.modOutstateData.Status) {
                $scope.statusOpt[opt].sel = 'selected';
            }
        }
        if ($scope.modOutstateData.IsACW) {
            $scope.IsACWOpt[0].sel = 'selected';
            $scope.modOutstateData.IsACW = "true";
        }else{
            $scope.IsACWOpt[1].sel = 'selected';
            $scope.modOutstateData.IsACW = "false";
        }
        $scope.updateOutstate = function () {
            var parm = {
                outstate: {
                    "OutstateCode": $scope.modOutstateData.OutstateCode,
                    "Description": $scope.modOutstateData.Description,
                    "Status": $scope.modOutstateData.Status,
                    "LongDescription": $scope.modOutstateData.LongDescription,
                    "Notes": $scope.modOutstateData.Notes,
                    "IsACW": $scope.modOutstateData.IsACW
                }
            };
            if (parm.outstate.Notes == null) {
                parm.outstate.Notes = "";
            }
            if (parm.outstate.Description == null) {
                parm.outstate.Description = "";
            }
            if (parm.outstate.LongDescription == null) {
                parm.outstate.LongDescription = "";
            }
            icSOAPServices.icGet("Outstate_Update", parm).then(
                function (data) {
//                    alert("Update Completed");
                    $location.path("/outstate");
                },
                function (response) {
                    alert("failed" + JSON.stringify(response));
                }
            );
        };
        $scope.cancelOutstateUpdate = function () {
            $location.path("/outstate");
        };
    }]);
    app.controller('OutstateaddCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.buttonName = "ADD";
        $scope.modOutstateData = {
            "OutstateCode": "xxxxx",
            "Description": "",
            "Status": "Active",
            "LongDescription": "",
            "Notes": "",
            "IsACW": ""
        };
        $scope.statusOpt = [
            {name: 'Active', sel: ''},
            {name: 'InActive', sel: ''}
        ];
        $scope.IsACWOpt = [
            {name: "true", sel: ''},
            {name: "false", sel: ''}
        ];
        for (var opt = 0; opt < $scope.statusOpt; opt++) {
            if ($scope.statusOpt[opt].name == $scope.modOutstateData.Status) {
                $scope.statusOpt[opt].sel = 'selected';
            }
        }

         $scope.updateOutstate = function () {
            if ($scope.modOutstateData.Description.length > 0) {
                var parm = {
                    outstate: {
                        "Description": $scope.modOutstateData.Description,
                        "Status": $scope.modOutstateData.Status,
                        "LongDescription": $scope.modOutstateData.LongDescription,
                        "Notes": $scope.modOutstateData.Notes
                    }
                };
                if (parm.outstate.Notes == null) {
                    parm.outstate.Notes = "";
                }
                if (parm.outstate.Description == null) {
                    parm.outstate.Description = "";
                }
                if (parm.outstate.LongDescription == null) {
                    parm.outstate.LongDescription = "";
                }
                icSOAPServices.icGet("Outstate_Add", parm).then(
                    function (data) {
                        $location.path("/outstate");
                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                    }
                );
            } else {
                alert("Need to input Outstate Description");
            }

        };
        $scope.cancelOutstateUpdate = function () {
            $location.path("/outstate");
        };
    }]);