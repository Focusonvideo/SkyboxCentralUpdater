'use strict';

angular.module('SkyboxApp')
.controller('View1Ctrl', ['$rootScope', '$scope', 'icSOAPServices', '$location', function( $rootScope, $scope, icSOAPServices , $location) {

    $scope.showSpinner = false;
    $scope.Acct = "";
        $scope.user = {
            name: "chester.ladewski@skyboxcommunications.com",
            pass: 'colleeN101',
            appName: 'Skybox_mobil',
            vendName: 'Skybox_communications',
            BusUnit: '', //'4594585',
            soapPass: '' //'10BC037E-35B9-4FBD-95A8-F342C0D9ACB8'
        };
    $scope.attemptLogin2 = function(newUser) {
        $scope.showSpinner = true;
        var url = {resource_server_base_uri: "https://login.incontact.com/"};
        SOAPClient.tokenData = url;
        // check if there is no soapPass - if not, look up BU in SF for soapPass
        if ($scope.user.soapPass == "" && $scope.user.BusUnit.length != "") {
            icSOAPServices.SFProxy($scope.user.BusUnit).then(
                function(newdata) { // good
                    if (newdata.data.records.length > 0) {
                        var SFData = newdata.data.records[0];
                        $scope.user.soapPass = SFData.inSideWS_Password__c;
                        $scope.Acct = SFData.Name;
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
        }else{
            doLogin();
        }
    };
    $scope.attemptLogin = function(newUser) {
        $scope.showSpinner = true;
        var url = {resource_server_base_uri: "https://login.incontact.com/"};
        SOAPClient.tokenData = url;
        // check if there is no soapPass - if not, look up BU in SF for soapPass
        if ($scope.user.soapPass == "" && $scope.user.BusUnit.length != "") {
            icSOAPServices.token().then(
                function(data){ // good
                    var tokenData = data.data;
                    var stmt = "SELECT BU_Number__c, Name, inSideWS_Password__c FROM Account WHERE BU_Number__c = '" + $scope.user.BusUnit + "'" ;
                    icSOAPServices.SFgetIt(stmt,tokenData).then(
                        function(newdata) { // good
                            if (newdata.data.records.length > 0) {
                                var SFData = newdata.data.records[0];
                                $scope.user.soapPass = SFData.inSideWS_Password__c;
                                $scope.Acct = SFData.Name;
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
    function doLogin (){


        SOAPClient.SOAPData = {
          BusNo : $scope.user.BusUnit,
          SOAPPass : $scope.user.soapPass
        };
        icSOAPServices.icGet("GetURL").then(
          function(data){
              SOAPClient.tokenData = {resource_server_base_uri : data.replace("inSideWS/inSideWS.asmx","")};
              icSOAPServices.icGet("TestConnection").then(
                  function(data){  // good
                      $scope.showSpinner = false;
                      $location.path("/main");
                      $rootScope.$emit('loggin_event');
                  },
                  function(response){
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