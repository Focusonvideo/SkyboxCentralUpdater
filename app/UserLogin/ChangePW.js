/**
 * Created by Chester on 8/15/2016.
 */
'use strict';

angular.module('SkyboxApp')

    .controller('ChangePWCtrl',
        ['$scope', '$rootScope', '$location', 'AuthenticationService',
            function ($scope, $rootScope, $location, AuthenticationService) {
                // reset login status
                AuthenticationService.ClearCredentials();

                $scope.newPW = function () {
                    $scope.dataLoading = true;
                    // verify pasword are the same
                    if ($scope.newPassword == $scope.Confirmpassword) {
                        // passwords are the same
                        var globalData = AuthenticationService.GetCredentials();
                        var username = globalData.currentUser.username;
                        AuthenticationService.UpdatePW(username, $scope.newPassword).then(
                            function (data) {
                                console.log(data);
                                $scope.dataLoading = false;
                                alert("Good:" + JSON.stringify(data));
                                if (data.status == 200) {
                                    // valid login - check if first time
                                    AuthenticationService.SetCredentials(username, $scope.newPassword);
                                         $location.path("/info");

                                } else {

                                        alert("Update problem");
                                        $scope.newPassword = "";
                                        $scope.Confirmpassword = "";
                                }
                            },
                            function (response) {
                                console.log(response);
                                $scope.dataLoading = false;
                                alert("BAD:" + JSON.stringify(response));
                            }
                        )
                    }else{
                        $scope.dataLoading = false;
                        alert("Passwords do not match");

                        $scope.newPassword = "";
                        $scope.Confirmpassword = "";
                    }

                };
            }]);
