/**
 * chester
 */
angular.module("SkyboxApp", ['angularSpinner', 'angularSoap','ngRoute','base64','ngCookies'])

    .controller('SkyboxController',['$rootScope', '$scope', 'icSOAPServices', '$soap', '$http',  function($rootScope, $scope, icSOAPServices, $soap, $http) {
        $scope.Acct = "";

        // Tab counter
//        var counter = 1;
        // Array to store the tabs
        $scope.LoggedIN = false;
        $scope.tabs = [{
            title: "Main",
            url: "MainPanel/Main.html",
            pgclass:"fa fa-shield",
            ref:"#main"
        }];
        $rootScope.$on('loggin_event', function () {
            $scope.LoggedIN = true;
        });
        $scope.$on('savedata',function(event,data) {
            //receive the data as second parameter
            $scope.Acct = data;
        });

    }])
    .controller('testController',function($scope){
        $scope.msg="hi there";
    })
    .config(function($routeProvider, $locationProvider, $httpProvider){
//        $httpProvider.defaults.useXdomain = true;
//        delete $httpProvider.defaults.headers.common['X-Requested-With'];
         $routeProvider
             .when('/info',{
                 templateUrl:'icLogin/login.html',
                 controller: 'View1Ctrl'
             })
             .when('/newPW',{
                 templateUrl:'UserLogin/ChangePW.html',
                 controller: 'ChangePWCtrl'
             })
            .when('/',{
                 templateUrl:'UserLogin/UserLogin.html',
                 controller: 'UserLoginCtrl'
             })
             .when('/initialization',{
                 templateUrl:'icLogin/login.html',
                 controller: 'View1Ctrl'
             })
             .when('/team',{
                 templateUrl:'TeamPanel/Team.html',
                 controller: 'TeamCtrl'
             })
             .when('/teammod',{
                 templateUrl:'TeamPanel/TeamAdd.html',
                 controller: 'TeammodCtrl'
             })
             .when('/teamadd',{
                 templateUrl:'TeamPanel/TeamAdd.html',
                 controller: 'TeamaddCtrl'
             })
             .when('/disposition',{
                 templateUrl:'DispositionPanel/Disposition.html',
                 controller: 'DispositionCtrl'
             })
             .when('/dispositionmod',{
                 templateUrl:'DispositionPanel/DispositionAdd.html',
                 controller: 'DispositionmodCtrl'
             })
             .when('/dispositionadd',{
                 templateUrl:'DispositionPanel/DispositionAdd.html',
                 controller: 'DispositionaddCtrl'
             })
             .when('/displistmod',{
                 templateUrl:'DispositionPanel/DispositionListMod.html',
                 controller: 'DispositionListCtrl'
             })
             .when('/teamoutstate',{
                 templateUrl:'TeamOutState/TeamOutState.html',
                 controller: 'TeamOutstateCtrl'
             })
             .when('/skilldisp',{
                 templateUrl:'SkillDisposition/SkillDisp.html',
                 controller: 'SkillDispCtrl'
             })
             .when('/outstate',{
                 templateUrl:'OutStatePanel/OutState.html',
                 controller: 'OutstateCtrl'
             })
             .when('/outstatemod',{
                 templateUrl:'OutStatePanel/OutStateAdd.html',
                 controller: 'OutstatemodCtrl'
             })
             .when('/outstateadd',{
                 templateUrl:'OutStatePanel/OutStateAdd.html',
                 controller: 'OutstateaddCtrl'
             })
             .when('/campaign',{
                 templateUrl:'CampaignPanel/Campaign.html',
                 controller: 'CampaignCtrl'
             })
             .when('/campaignmod',{
                 templateUrl:'CampaignPanel/CampaignAdd.html',
                 controller: 'CampaignmodCtrl'
             })
             .when('/campaignadd',{
                 templateUrl:'CampaignPanel/CampaignAdd.html',
                 controller: 'CampaignaddCtrl'
             })
             .when('/skillAdd',{
                 templateUrl:'SkillPanel/SkillAddMod.html',
                 controller: 'SkillAddCtrl'
             })
             .when('/skillBRDAdd',{
                 templateUrl:'SkillPanel/SkillBRDAdd.html',
                 controller: 'SkillBRDAddCtrl'
             })
             .when('/skillMod',{
                 templateUrl:'SkillPanel/SkillAddMod.html',
                 controller: 'SkillModCtrl'
             })
             .when('/skill',{
                 templateUrl:'SkillPanel/Skill.html',
                 controller: 'SkillCtrl'
             })
             .when('/skillPost',{
                 templateUrl:'SkillPanel/SkillPostContactMapping.html',
                 controller: 'SkillPostContactCtrl'
             })
             .when('/skillList',{
                 templateUrl:'SkillPanel/SkillListMod.html',
                 controller: 'SkillListModCtrl'
             })
             .when('/agent',{
                 templateUrl:'Agents/Agent.html',
                 controller: 'AgentCtrl'
             })
             .when('/POC',{
                 templateUrl:'POCs/POCs.html',
                 controller: 'POCCtrl'
             })
             .when('/agentSkill',{
                 templateUrl:'AgentSkill/AgentSkill.html',
                 controller: 'AgentSkillCtrl'
             })
             .when('/main',{
                templateUrl:'MainPanel/Main.html',
                controller: 'MainCtrl'
            });
        $locationProvider.html5Mode({
            enable:true,
            requireBase:false
        });
    });


