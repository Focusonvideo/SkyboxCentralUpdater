/**
 *
 */
angular.module("SkyboxApp", ['angularSpinner', 'angularSoap','ngRoute'])

    .controller('SkyboxController',['$rootScope', '$scope', 'icSOAPServices', '$soap', '$http',  function($rootScope, $scope, icSOAPServices, $soap, $http) {
        $scope.ccc = "good";

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


  /*      icSOAPServices.token().then(
            function(data){ // good
                tokenData = data.data;
                // set current contactId based on AgentID;
                SOAPClient.tokenData = tokenData;
                /*				icSOAPServices.icGet("Skill_GetList").then(function(response){
                 alert(JSON.stringify(response));
                 },
                 function(errors){
                 alert(errors);
                 },
                 function(unknown){
                 alert("AppUnkownError");
                 alert(unknown);
                 });
                 icSOAPServices.icGet("Agent_GetList").then(function(response){
                 alert(JSON.stringify(response));
                 },
                 function(errors){
                 alert(errors);
                 },
                 function(unknown){
                 alert("AppUnkownError");
                 alert(unknown);
                 });  */
 /*               var parm = {"agentNo" : "447493"};
                icSOAPServices.icGet("Agent_Find", parm).then(function(response){
                        alert(JSON.stringify(response));
                    },
                    function(errors){
                        alert(errors);
                    },
                    function(unknown){
                        alert("AppUnkownError");
                        alert(unknown);
                    });

            },
            function(e){ //error
                alert(JSON.stringify(e));
            }
        ); */

    }])
    .controller('testController',function($scope){
        $scope.msg="hi there";
    })
    .config(function($routeProvider, $locationProvider){
         $routeProvider
             .when('/',{
                 templateUrl:'icLogin/login.html',
                 controller: 'View1Ctrl'
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
             .when('/skill',{
                 templateUrl:'SkillPanel/Skill.html',
                 controller: 'SkillCtrl'
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


