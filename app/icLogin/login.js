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
//        alert(JSON.stringify(newUser));
        $scope.showSpinner = true;
        icSOAPServices.token(newUser).then(
            function(data) { // good
              var tokenData = data.data;
//              alert(JSON.stringify(tokenData));
              SOAPClient.tokenData = tokenData;
              SOAPClient.SOAPData = {
                  BusNo : newUser.BusUnit,
                  SOAPPass : newUser.soapPass
              };
              icSOAPServices.icGet("TestConnection").then(
                  function(data){
//                    alert("DATA:" + JSON.stringify(data));
                    $scope.showSpinner = false;
                    $location.path("/main");
                    $rootScope.$emit('loggin_event');
                  },
                  function(response){
                      $scope.showSpinner = false;
                      alert("ERROR:" + JSON.stringify(response));
                  }
              )
            } ,
            function(response) {  // bad
              alert(JSON.stringify(response));
              alert("Cannot Log into InContact - verify login parameters");
            }
        )
    }
}]);