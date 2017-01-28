'use strict';
/* this is mine */
angular.module('SkyboxApp')

.controller('MainCtrl', ['$scope',function($scope) {
//    alert("here");
    $scope.acct = "ccc";
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
            title: "Agent/Skill",
            url: "AgentSkill/AgentSkill.html",
            pgclass:"fa fa-shield",
            ref:"#agentSkill"
        },
        {
            title: "Agents",
            url: "Agents/Agent.html",
            pgclass:"fa fa-shield",
            ref:"#agent"
        },
        {
            title: "POCs",
            url: "POCs/POCs.html",
            pgclass:"fa fa-shield",
            ref:"#POC"
        },
        {
            title: "Skill",
            url: "SkillPanel/Skill.html",
            pgclass:"fa fa-shield",
            ref:"#skill"
        }
    ];
}]);