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
//                    alert("Update Completed");
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
            {name: 'Active', sel: 'selected'},
            {name: 'InActive', sel: ''}
        ];
 /*       for (var opt = 0; opt < $scope.statusOpt; opt++) {
            if ($scope.statusOpt[opt].name == $scope.modDispositionData.Status) {
                $scope.statusOpt[opt].sel = 'selected';
            }
        } */
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
 //                       alert("Addition Completed");
                        $location.path("/disposition");
                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                    }
                );
            } else {
                if($scope.massDispInput != ""){
                    var DispList = $scope.massDispInput.split(String.fromCharCode(10));
                    $scope.DispAdds = new Array(DispList.length);
                    for (var x=0;x<DispList.length;x++){
                        $scope.DispAdds[x] = {name : DispList[x],
                            Processed : false };
                    }
                    ProcessList();
                }else{
                    $scope.showSpinner = false;
                    alert("Need Disposition Name(s)");
                }
            }

        };
        function ProcessList(){
            var found = false;
            for (var i=0;i<$scope.DispAdds.length;i++){
                if(!$scope.DispAdds[i].Processed){
                    found = true;
                    var parm = {
                        disposition: {
                            "Description": $scope.DispAdds[i].name,
                            "Status": "Active",
                            "LongDescription": "",
                            "Notes": ""
                        }
                    };
                    $scope.DispAdds[i].Processed = true;

                    DoAdd(parm);
                    break;
                }
            }
            if(!found){
                $scope.showSpinner = false;
                $location.path("/disposition");
            }
        }
        function DoAdd(inputParm){
           icSOAPServices.icGet("Disposition_Add", inputParm).then(
                function (data) {
                    //                   alert("Addition Completed");
                    ProcessList();
                },
                function (response) {
                    alert("failed" + JSON.stringify(response));
                    $scope.showSpinner = false;
                }
            );
        }

        $scope.cancelDispositionUpdate = function () {
            $location.path("/disposition");
        };
    }]);