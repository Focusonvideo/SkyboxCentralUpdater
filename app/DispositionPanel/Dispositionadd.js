/**
 * Created by Chester on 2/4/16.
 */
'use strict';

var app = angular.module('SkyboxApp');
    app.controller('DispositionmodCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.buttonName = "UPDATE";
        $scope.modDispositionData = SOAPClient.passData;
        $scope.statusOpt = [
            {name: 'Active', sel: ''},
            {name: 'InActive', sel: ''}
        ];
        for (var opt = 0; opt < $scope.statusOpt; opt++) {
            if ($scope.statusOpt[opt].name == $scope.modDispositionData.Status) {
                $scope.statusOpt[opt].sel = 'selected';
            }
        }
        $scope.updateDisposition = function () {
            var parm = {
                disposition: {
                    "DispositionID": $scope.modDispositionData.DispositionID,
                    "Description": $scope.modDispositionData.Description,
                    "Status": $scope.modDispositionData.Status,
                    "LongDescription": $scope.modDispositionData.LongDescription,
                    "Notes": $scope.modDispositionData.Notes
                }
            };
            if (parm.disposition.Notes == null) {
                parm.disposition.Notes = "";
            }
            if (parm.disposition.Description == null) {
                parm.disposition.Description = "";
            }
            if (parm.disposition.LongDescription == null) {
                parm.disposition.LongDescription = "";
            }
            icSOAPServices.icGet("Disposition_Update", parm).then(
                function (data) {
                    alert("Update Completed");
                    $location.path("/disposition");
                },
                function (response) {
                    alert("failed" + JSON.stringify(response));
                }
            );
        };
        $scope.cancelDispositionUpdate = function () {
            $location.path("/disposition");
        };
    }]);
    app.controller('DispositionaddCtrl', ['$scope', 'icSOAPServices', '$location', function ($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.buttonName = "ADD";
        $scope.modDispositionData = {
            "DispositionID": "xxxxx",
            "Description": "",
            "Status": "Active",
            "LongDescription": "",
            "Notes": ""
        };
        $scope.statusOpt = [
            {name: 'Active', sel: ''},
            {name: 'InActive', sel: ''}
        ];
        for (var opt = 0; opt < $scope.statusOpt; opt++) {
            if ($scope.statusOpt[opt].name == $scope.modDispositionData.Status) {
                $scope.statusOpt[opt].sel = 'selected';
            }
        }
        $scope.updateDisposition = function () {
            if ($scope.modDispositionData.Description.length > 0) {
                var parm = {
                    disposition: {
                        "Description": $scope.modDispositionData.Description,
                        "Status": $scope.modDispositionData.Status,
                        "LongDescription": $scope.modDispositionData.LongDescription,
                        "Notes": $scope.modDispositionData.Notes
                    }
                };
                if (parm.disposition.Notes == null) {
                    parm.disposition.Notes = "";
                }
                if (parm.disposition.Description == null) {
                    parm.disposition.Description = "";
                }
                if (parm.disposition.LongDescription == null) {
                    parm.disposition.LongDescription = "";
                }
                icSOAPServices.icGet("Disposition_Add", parm).then(
                    function (data) {
                        alert("Addition Completed");
                        $location.path("/disposition");
                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                    }
                );
            } else {
                alert("Need to input Disposition Description");
            }

        };
        $scope.cancelDispositionUpdate = function () {
            $location.path("/disposition");
        };
    }]);