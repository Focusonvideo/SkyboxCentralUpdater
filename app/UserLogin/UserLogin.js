/**
 * Created by Chester on 3/20/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('UserLoginCtrl', ['$scope', 'icSOAPServices', '$location',  function($scope, icSOAPServices, $location) {
        $scope.login = function(){
            $scope.dataLoading = true;
            // put Id & PW check here



            // if ok
            $location.path("/initialization");
            //else
            $scope.dataLoading = false;
        }
    }]);