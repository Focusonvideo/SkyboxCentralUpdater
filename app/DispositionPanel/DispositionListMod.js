/**
 * Created by Chester on 2/4/16.
 */
'use strict';

var app = angular.module('SkyboxApp');
    app.controller('DispositionListCtrl', ['$scope', 'icSOAPServices', '$location', '$filter', function ($scope, icSOAPServices, $location, $filter) {
        var orderBy = $filter('orderBy');
        $scope.showSpinner = false;
        $scope.buttonName = "UPDATE ALL";
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
        icSOAPServices.icGet("Disposition_GetList").then(
            function(data){
                $scope.showSpinner = false;
                var orderedlist;
                orderedlist = orderBy(data, "Description", false);
                $scope.DispositionData = orderedlist;  //original list
                $scope.DispList = JSON.parse(JSON.stringify(orderedlist));
//                $scope.DispList = orderedlist.slice(0);

            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        console.log($scope);
        $scope.updateDisp = function () {
            // determine if any change was made
            var total = 0;
            $scope.showSpinner = true;
            for (var x=0;x < $scope.DispList.length;x++){
                var foundChange = false;

                if ($scope.DispositionData[x].Description != $scope.DispList[x].Description){
                    foundChange = true;
                }
                if ($scope.DispositionData[x].Status != $scope.DispList[x].Status) {
                    foundChange = true;
                }
                if ($scope.DispositionData[x].LongDescription != $scope.DispList[x].LongDescription){
                    foundChange = true;
                }
                if ($scope.DispositionData[x].Notes != $scope.DispList[x].Notes){
                    foundChange = true;
                }

                if(foundChange){
                    var parm = {
                        disposition: {
                            "DispositionID": $scope.DispList[x].DispositionID,
                            "Description": $scope.DispList[x].Description,
                            "Status": $scope.DispList[x].Status,
                            "LongDescription": $scope.DispList[x].LongDescription,
                            "Notes": $scope.DispList[x].Notes
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

                    total++;
                    icSOAPServices.icGet("Disposition_Update", parm).then(
                        function () {
                            total--;
                            if (total == 0){
                                $location.path("/disposition");
                                $scope.showSpinner = false;
                            }
                        },
                        function (response) {
                            alert("failed" + JSON.stringify(response));
                        }
                    );
                }

            }
        };
        $scope.cancelDisposition = function () {
            $location.path("/disposition");
        };
    }]);
