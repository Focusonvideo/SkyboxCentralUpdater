/**
 * Created by Chester on 3/20/16.
 */
'use strict';

angular.module('SkyboxApp')

    .controller('UserLoginCtrl',
        ['$scope', '$rootScope', '$location', 'AuthenticationService',
            function ($scope, $rootScope, $location, AuthenticationService) {
                // reset login status
                AuthenticationService.ClearCredentials();

                $scope.login = function () {
                   $scope.dataLoading = true;
                    AuthenticationService.Login($scope.username, $scope.password).then(
                        function(data){
                            $scope.dataLoading = false;
 //                           alert(JSON.stringify(data));
                            if(data.status == 200){
                                // valid login - check if first time
                                var count = data.data.Result;
                                if (count != 0) {
                                    // valid account - goto next screen
                                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                                    $location.path("/info");
                                }else{
                                    // new account - have user enter a new pw
                                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                                    $location.path('/newPW');
                                }

                            }else{
                                if (data.status == 201){
                                    alert("Login is Invalid. Check Username and Password.");
                                    $scope.password = "";
                                }else{
                                    alert("Your login has EXPIRED.   Please contact Skybox to extend you logon access.")
                                }
                            }
                         },
                        function(response){
                            console.log(response);
                            $scope.dataLoading = false;
                             alert("BAD:" + JSON.stringify(response));
                        }

                    )

                };
            }]);
