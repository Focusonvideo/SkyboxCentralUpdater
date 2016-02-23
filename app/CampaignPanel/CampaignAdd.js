/**
 * Created by Chester on 2/5/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('CampaignmodCtrl', ['$scope', 'icSOAPServices', '$location', function($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.modCampaignData = SOAPClient.passData;
        $scope.buttonName = "UPDATE";
        $scope.statusOpt = [
            {name:'Active', sel:''},
            {name:'InActive', sel:''}
        ];
        for (var opt = 0;opt < $scope.statusOpt;opt++){
            if($scope.statusOpt[opt].name == $scope.modCampaignData.Status){
                $scope.statusOpt[opt].sel = 'selected';
            }
        }
        $scope.updateCampaign = function(){
            var parm ={campaign : {"CampaignNo":$scope.modCampaignData.CampaignNo,
                "CampaignName":$scope.modCampaignData.CampaignName,
                "Status":$scope.modCampaignData.Status,
                "Description":$scope.modCampaignData.Description,
                "Notes":$scope.modCampaignData.Notes,
            }};
            if(parm.campaign.Notes == null){
                parm.campaign.Notes = "";
            }
            if(parm.campaign.Description == null){
                parm.campaign.Description = "";
            }

            icSOAPServices.icGet("Campaign_Update",parm).then(
                function(data){
 //                   alert("Update Completed");
                    $location.path("/campaign");
                },
                function(response){
                    alert("failed" + JSON.stringify(response));
                }
            );
        };
        $scope.cancelCampaignUpdate =  function(){
            $location.path("/campaign");
        };
    }])
    .controller('CampaignaddCtrl', ['$scope', 'icSOAPServices', '$location', function($scope, icSOAPServices, $location) {
        $scope.showSpinner = false;
        $scope.buttonName = "ADD";
        $scope.modCampaignData = {
            "CampaignNo": "xxxxx",
            "CampaignName": "",
            "Status": "Active",
            "Description": "",
            "Notes": ""
        };
        $scope.statusOpt = [
            {name: 'Active', sel: 'selected'},
            {name: 'InActive', sel: ''}
        ];
        /*        for (var opt = 0;opt < $scope.statusOpt;opt++){
         if($scope.statusOpt[opt].name == $scope.modCampaignData.Status){
         $scope.statusOpt[opt].sel = 'selected';
         }
         } */
        $scope.updateCampaign = function () {
            $scope.showSpinner = true;

            if ($scope.modCampaignData.CampaignName != "") {
                var parm = {
                    campaign: {
                        "CampaignName": $scope.modCampaignData.CampaignName,
                        "Status": $scope.modCampaignData.Status,
                        "Description": $scope.modCampaignData.Description,
                        "Notes": $scope.modCampaignData.Notes
                    }
                };
                if (parm.campaign.Notes == null) {
                    parm.campaign.Notes = "";
                }
                if (parm.campaign.Description == null) {
                    parm.campaign.Description = "";
                }

                icSOAPServices.icGet("Campaign_Add", parm).then(
                    function (data) {
                        //                   alert("Addition Completed");
                        $scope.showSpinner = false;
                        $location.path("/campaign");
                    },
                    function (response) {
                        alert("failed" + JSON.stringify(response));
                        $scope.showSpinner = false;
                    }
                );
            }else{
                if($scope.massInput != ""){
                    var campaignList = $scope.massInput.split(String.fromCharCode(10));
                    $scope.CampaignAdds = new Array(campaignList.length);
                    for (var x=0;x<campaignList.length;x++){
                        $scope.CampaignAdds[x] = {name : campaignList[x],
                                            Processed : false };
                    }
                    ProcessList();
                 }else{
                    $scope.showSpinner = false;
                    alert("Need Campaign Name(s)");
                }
            }
        };
        function ProcessList(){
            var found = false;
            for (var i=0;i<$scope.CampaignAdds.length;i++){
                if(!$scope.CampaignAdds[i].Processed){
                    found = true;
                    var parm = {
                        campaign: {
                            "CampaignName": $scope.CampaignAdds[i].name,
                            "Status": "Active",
                            "Description": "",
                            "Notes": ""
                        }
                    };
                    $scope.CampaignAdds[i].Processed = true;

                    DoAdd(parm);
                    break;
                }
            }
            if(!found){
                $scope.showSpinner = false;
                $location.path("/campaign");
            }
        }
        function DoAdd(inputParm){
            icSOAPServices.icGet("Campaign_Add", inputParm).then(
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
        $scope.cancelCampaignUpdate =  function(){
            $location.path("/campaign");
        };
    }]);