/**
 * Created by Chester on 3/20/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillPostContactCtrl', ['$scope', 'icSOAPServices', '$location', '$filter' ,function($scope, icSOAPServices, $location, $filter) {
        var orderBy = $filter('orderBy');
        $scope.showSpinner = true;
        var token = SOAPClient.ICToken;
        var extURL = 'services/v7.0/skills';
        function parseBool(val) { return val === true || val === "True" }


        icSOAPServices.ICGET(token, extURL).then(
            function(data){
                var orderedlist = orderBy(data.data.resultSet.skills, "skillName", false);
                $scope.Skills = orderedlist;
                for (var x =0;x<$scope.Skills.length;x++){
                    $scope.Skills[x].index = x;
                    $scope.Skills[x].agentless = parseBool($scope.Skills[x].agentless);
                    $scope.Skills[x].requireDisposition = parseBool($scope.Skills[x].requireDisposition);
                    switch ($scope.Skills[x].acwTypeId){
                        case "1":
                            $scope.Skills[x].DispACW = "None";
                            break;
                        case "2":
                            $scope.Skills[x].DispACW = "Disp";
                            break;
                        case "3":
                            $scope.Skills[x].DispACW = "ACW";
                            break;
                    }
                }

                $scope.showSpinner = false;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        ;
        console.log($scope);
 
    }]);