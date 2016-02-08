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
                    alert("Update Completed");
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
        $scope.modTeamData = {
            "CampaignNo": "xxxxx",
            "CampaignName": "",
            "Status": "Active",
            "Description": "",
            "Notes": ""
        };
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
            var parm ={campaign : {
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

            icSOAPServices.icGet("Campaign_Add",parm).then(
                function(data){
                    alert("Addition Completed");
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
    }]);