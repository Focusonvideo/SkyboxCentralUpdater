'use strict';
/* this is mine */
angular.module('SkyboxApp')

.controller('MainCtrl', ['$scope',function($scope) {
//    alert("here");
    $scope.maintabs = [
        {
            title: "Team",
            url: "TeamPanel/Team.html",
            pgclass:"fa fa-shield",
            ref:"#team"
        },
        {
            title: "Campaign",
            url: "CampaignPanel/Campaign.html",
            pgclass:"fa fa-shield",
            ref:"#campaign"
        },
        {
            title: "Disposition",
            url: "DispositionPanel/Disposition.html",
            pgclass:"fa fa-shield",
            ref:"#disposition"
        },
        {
            title: "Unavailable",
            url: "OutStatePanel/Outstate.html",
            pgclass:"fa fa-shield",
            ref:"#outstate"
        },
        {
            title: "Team/Unavailable",
            url: "TeamOutState/TeamOutState.html",
            pgclass:"fa fa-shield",
            ref:"#teamoutstate"
        },
        {
            title: "Skill/Disposition",
            url: "SkillDisposition/SkillDisp.html",
            pgclass:"fa fa-shield",
            ref:"#skilldisp"
        },
        {
            title: "Agents",
            url: "Agents/Agent.html",
            pgclass:"fa fa-shield",
            ref:"#agent"
        },
        {
            title: "Skill",
            url: "SkillPanel/Skill.html",
            pgclass:"fa fa-shield",
            ref:"#skill"
        }
    ];
}]);