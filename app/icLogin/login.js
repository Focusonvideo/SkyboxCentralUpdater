'use strict';

angular.module('SkyboxApp')
.controller('View1Ctrl', ['$rootScope', '$scope', 'icSOAPServices', '$location', '$filter', function( $rootScope, $scope, icSOAPServices , $location, $filter) {
    $scope.ICToken = {};
    $scope.showSpinner = false;
    var orderBy = $filter('orderBy');
    $scope.Acct = "";
        $scope.user = {
            name:'', //   "chester.ladewski@skyboxcommunications.com",
            pass:'', //  'colleeN101',
            appName:'', //   'Skybox_mobil',
            vendName:'', //  'Skybox_communications',
            BusUnit:'', //  '4594585',
            soapPass:'' //  '10BC037E-35B9-4FBD-95A8-F342C0D9ACB8'
        };
 /*   icSOAPServices.SFListProxy().then(
        function(Listdata) { // good
            var orderedlist;
            orderedlist = orderBy(Listdata.data.records, "Name", false);
            $scope.BUList = orderedlist;
        },
        function(res){ // error
            alert(JSON.stringify(res));
        }
    );
    console.log($scope); */
    $scope.attemptLogin2 = function() {
        $scope.showSpinner = true;
        var url;
        url = {resource_server_base_uri: "https://login.incontact.com/"};
        SOAPClient.tokenData = url;
        // check if there is no soapPass - if not, look up BU in SF for soapPass
        if ($scope.user.soapPass == "" && $scope.user.BusUnit.length != "") {
            icSOAPServices.SFProxy($scope.user.BusUnit).then(
                function(newdata) { // good
                    if (newdata.data.records.length > 0) {
                        var SFData = newdata.data.records[0];
                        var items = 0;
                         $scope.user.soapPass = SFData.inSideWS_Password__c;
                        if($scope.user.soapPass != "" && $scope.user.soapPass != null ) items++;
                        $scope.user.vendName = SFData.Vendor__c;
                        if($scope.user.vendName != "" && $scope.user.vendName != null ) items++;
                        $scope.user.appName = SFData.Application__c;
                        if($scope.user.appName != "" && $scope.user.appName != null ) items++;
                        $scope.user.name = SFData.SkyBox_BU_Login__c;
                        if($scope.user.name != "" && $scope.user.name != null ) items++;
                        $scope.user.pass = SFData.SkyBox_BU_Password__c;
                        if($scope.user.pass != "" && $scope.user.pass != null ) items++;
                        $scope.Acct = SFData.Name;
                        console.log($scope);
                        if (items == 5) {
                            doLogin();
                        }else{
                            $scope.showSpinner = false;
                            alert("missing login information");
                        }
                    }else{
                        $scope.showSpinner = false;
                        alert("SOAP Password needed");
                    }
                },
                function(res){ // error
                    $scope.showSpinner = false;
                    alert(JSON.stringify(res));
                }
            );
        }else{
            var items = 0;
            if($scope.user.soapPass != "" && $scope.user.soapPass != null ) items++;
            if($scope.user.vendName != "" && $scope.user.vendName != null ) items++;
            if($scope.user.appName != "" && $scope.user.appName != null ) items++;
            if($scope.user.name != "" && $scope.user.name != null ) items++;
            if($scope.user.pass != "" && $scope.user.pass != null ) items++;
            if (items == 5) {
                doLogin();
            }else{
                $scope.showSpinner = false;
                alert("missing login information");
            }
        }
    };
    $scope.attemptLogin = function() {
        $scope.showSpinner = true;
        var url;
        url = {resource_server_base_uri: "https://login.incontact.com/"};
        SOAPClient.tokenData = url;
        // check if there is no soapPass - if not, look up BU in SF for soapPass
        if ($scope.user.soapPass == "" && $scope.user.BusUnit.length != "") {
            icSOAPServices.token().then(
                function(data){ // good
                    var tokenData = data.data;
                    var stmt = "SELECT BU_Number__c, Name, inSideWS_Password__c, Vendor__c, Application__c, SkyBox_BU_Login__c, SkyBox_BU_Password__c FROM Account WHERE BU_Number__c = '" + $scope.user.BusUnit + "'" ;
                    icSOAPServices.SFgetIt(stmt,tokenData).then(
                        function(newdata) { // good
                            if (newdata.data.records.length > 0) {
                                var SFData = newdata.data.records[0];
                                $scope.SF_Return = SFData;
                                $scope.user.soapPass = SFData.inSideWS_Password__c;
                                $scope.Acct = SFData.Name;
                                alert(JSON.stringify(SFData));
                                console.log($scope);
                                doLogin();

                            }else{
                                $scope.showSpinner = false;
                                alert("SOAP Password needed");
                            }
                        },
                        function(res){ // error
                            alert(JSON.stringify(res));
                        }
                    );
                },
                function(response){ //error
                    alert(JSON.stringify(response));
                },
                function(notif){ // notify
                    alert("notify: " + notif);
                });
        }else{
            doLogin();
        }
    };
    function getICToken(){
        var auth = $scope.user.appName + '@' + $scope.user.vendName + ':' + $scope.user.BusUnit;
        var ICuser = $scope.user.name;
        var ICPass = $scope.user.pass;
        icSOAPServices.ICToken(auth, ICuser, ICPass).then(
            function(data){
                $scope.ICToken = data.data;
                SOAPClient.ICToken = $scope.ICToken;
                $scope.showSpinner = false;
                $location.path("/main");
                $rootScope.$emit('loggin_event');
            },
            function(response){
                alert(JSON.stringify(response));
            }
        );
        return false;
    }

    function doLogin (){
        SOAPClient.SOAPData = {
          BusNo : $scope.user.BusUnit,
          SOAPPass : $scope.user.soapPass
        };
        icSOAPServices.icGet("GetURL").then(
          function(data){
              SOAPClient.tokenData = {resource_server_base_uri : data.replace("inSideWS/inSideWS.asmx","")};
              icSOAPServices.icGet("TestConnection").then(
                  function() {  // good
                      getICToken();
                  },
                  function(){
                      $scope.showSpinner = false;
                  }
              );
          },
          function(response){
              $scope.showSpinner = false;
              alert("ERROR GETURL:" + JSON.stringify(response));
          }
        );
    }
}]);