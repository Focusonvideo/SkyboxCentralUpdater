'use strict';

angular.module('SkyboxApp')
.controller('View1Ctrl', ['$rootScope', '$scope', 'icSOAPServices', '$location', function( $rootScope, $scope, icSOAPServices , $location) {

  $scope.showSpinner = false;

  $scope.user = {
      name: "chester.ladewski@skyboxcommunications.com",
      pass: 'colleeN101',
      appName: 'Skybox_mobil',
      vendName: 'Skybox_communications',
      BusUnit: '4594585',
      soapPass: '10BC037E-35B9-4FBD-95A8-F342C0D9ACB8'
    };
    $scope.attemptLogin = function(newUser){
        $scope.showSpinner = true;
        var url = {resource_server_base_uri : "https://login.incontact.com/"};
        SOAPClient.tokenData = url;
        SOAPClient.SOAPData = {
          BusNo : newUser.BusUnit,
          SOAPPass : newUser.soapPass
        };
        icSOAPServices.icGet("GetURL").then(
          function(data){
              url = {resource_server_base_uri : data.replace("inSideWS.asmx","")};
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
              alert("ERROR:" + JSON.stringify(response));
          }
        );
    }
}]);