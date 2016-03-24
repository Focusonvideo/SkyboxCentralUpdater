/**
 * Created by Chester on 2/4/16.
 */
'use strict';

angular.module('SkyboxApp')
    .controller('SkillDispCtrl', ['$scope', 'icSOAPServices', '$location', '$filter',  function($scope, icSOAPServices, $location, $filter) {
        $scope.showSpinner = true;
        $scope.modSkillSelected = "";
        $scope.newAssociated = "";
        $scope.showAddConfig = false;
        $scope.showUseConfig = false;
        var orderBy = $filter('orderBy');
        icSOAPServices.icGet("Skill_GetList").then(
            function(data){
                $scope.showSpinner = false;
                var orderedlist = orderBy(data,"SkillName",false);
                $scope.skills = orderedlist;
                for (var x = 0; x < $scope.skills.length; x++){
                    $scope.skills[x].Selected = "";
                }
                $scope.skills[3].Selected = 'selected="selected"';
                $scope.modSkillSelected = $scope.skills[3].SkillNo;
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        icSOAPServices.icGet("Disposition_GetList").then(
            function(data){
                $scope.showSpinner = false;
                $scope.SkillDispData = data;
                for(var i=0;i<$scope.SkillDispData.length;i++){
                    $scope.SkillDispData[i].yesnos = [
                        {name:"Yes", sel:"selected"},
                        {name:"No", sel:""}
                    ];
                    $scope.SkillDispData[i].useSelected = [
                        {sel:""},
                        {sel:""}
                    ];
                    $scope.SkillDispData[i].idx = i;
                }
            },
            function(response){
                $scope.showSpinner = false;
                alert("BAD:" + JSON.stringify(response));
            }
        );
        console.log($scope);
        $scope.skillSelected = function(){
            for(var i=0;i<$scope.SkillDispData.length;i++){
                $scope.SkillDispData[i].AssocChanged = false;
            }
            for (var x=0;x<$scope.skills.length;x++){
                if($scope.modSkillSelected == $scope.skills[x].SkillName){
                    $scope.skillID = $scope.skills[x].SkillNo
                }
            }
            var parm = {"skillNo":$scope.skillID};
            $scope.showSpinner = true;
            icSOAPServices.icGet("SkillDisposition_GetList", parm).then(
                function(data){
                    $scope.showSpinner = false;
                    $scope.skilloutdata = data;
                    for(var i=0;i<$scope.SkillDispData.length;i++){
                        var found = false;
                        for(var x=0;x<data.length;x++){
                            if(data[x].DispositionID == $scope.SkillDispData[i].DispositionID){
                                found = true;
                                break;
                            }
                        }
                        if(found){
                            $scope.SkillDispData[i].SkillNo = $scope.skillID;

//                            $scope.SkillDispData[i].Assoc = "Yes";
                            $scope.SkillDispData[i].Assoc = true;

                            $scope.SkillDispData[i].yesnos[0].sel = 'selected';
                            $scope.SkillDispData[i].yesnos[1].sel = '';
                            $scope.SkillDispData[i].ListPriority = data[x].ListPriority;
                            $scope.SkillDispData[i].UseComments = data[x].UseComments;
                            $scope.SkillDispData[i].CommentsRequired = data[x].CommentsRequired;
                            $scope.SkillDispData[i].SkillDispositionID = data[x].SkillDispositionID;
                            $scope.SkillDispData[i].showit = true;
                            if(data[x].UseComments){
                                $scope.SkillDispData[i].useComm = "true";
                                $scope.SkillDispData[i].useSelected[0].sel = "selected";
                                $scope.SkillDispData[i].useSelected[1].sel = "";
                            }else{
                                $scope.SkillDispData[i].useComm = "false";
                                $scope.SkillDispData[i].useSelected[0].sel = "";
                                $scope.SkillDispData[i].useSelected[1].sel = "Selected";
                            }

                        }else{
                            $scope.SkillDispData[i].SkillNo = $scope.skillID;
                            $scope.SkillDispData[i].showit = false;
                            $scope.SkillDispData[i].useComm = "";
 //                           $scope.SkillDispData[i].Assoc = "No";
                            $scope.SkillDispData[i].Assoc = false;
                            $scope.SkillDispData[i].yesnos[1].sel = 'selected';
                            $scope.SkillDispData[i].yesnos[0].sel = '';
                            $scope.SkillDispData[i].ListPriority = "";
                            $scope.SkillDispData[i].UseComments = "false";
                            $scope.SkillDispData[i].CommentsRequired = "false";
                            $scope.SkillDispData[i].useSelected[0].sel = "";
                            $scope.SkillDispData[i].useSelected[1].sel = "";
                        }
                    }

                },
                function(response){
                    $scope.showSpinner = false;
                    alert("BAD:" + JSON.stringify(response));
                }
            );
            console.log($scope);
            $scope.showAddConfig = true;

        };
        $scope.priorityChanged = function(index){
            // priorities change
            $scope.SkillDispData[index].propertyChanged = true;

        };
        $scope.useComChanged = function(index){
            // Use Comments change
            $scope.SkillDispData[index].propertyChanged = true;

        };
        $scope.reqComChanged = function(index){
            // require Comments
            $scope.SkillDispData[index].propertyChanged = true;

        };
        $scope.AssocChanged = function(index){
            $scope.SkillDispData[index].AssocChanged = true;
           if($scope.SkillDispData[index].Assoc == false){
                // reset show
                $scope.SkillDispData[index].showit = false;
               // remove from list priority
               var curPri = $scope.SkillDispData[index].ListPriority;
               $scope.SkillDispData[index].ListPriority = "";
               for (var x=0;x < $scope.SkillDispData.length; x++) {
                   if ($scope.SkillDispData[x].ListPriority > curPri ) {
                       $scope.SkillDispData[x].ListPriority = $scope.SkillDispData[x].ListPriority - 1;
                   }
               }
           }else{
                $scope.SkillDispData[index].showit = true;
                // add to list priority
               //find current max priority this will be the next
               var maxPri = 0;
               for (var x=0;x < $scope.SkillDispData.length; x++) {
                   if ($scope.SkillDispData[x].ListPriority > maxPri ) {
                       maxPri = $scope.SkillDispData[x].ListPriority;
                   }
               }
               $scope.SkillDispData[index].ListPriority = maxPri + 1;
           }
        };
        $scope.SaveConfig = function(){
            $scope.savedConfig = new Array($scope.SkillDispData.length);
            for (var x=0;x < $scope.SkillDispData.length; x++) {
                $scope.savedConfig[x]= {Assoc : $scope.SkillDispData[x].Assoc,
                             CommentsRequired : $scope.SkillDispData[x].CommentsRequired,
                                 ListPriority : $scope.SkillDispData[x].ListPriority,
                                        Status: $scope.SkillDispData[x].Status,
                                  UseComments : $scope.SkillDispData[x].UseComments,
                                       showit : $scope.SkillDispData[x].showit,
                                      UseComm : $scope.SkillDispData[x].UseComm,
                                    useSelected:[{sel:$scope.SkillDispData[x].useSelected[0].sel},
                                                {sel:$scope.SkillDispData[x].useSelected[1].sel}],
                                         yesnos:[{name:$scope.SkillDispData[x].yesnos[0].name,
                                                  sel:$scope.SkillDispData[x].yesnos[0].sel},
                                                {name:$scope.SkillDispData[x].yesnos[1].name,
                                                  sel:$scope.SkillDispData[x].yesnos[1].sel}
                                        ]
                }

            }
            $scope.showUseConfig = true;
        };
        $scope.UseConfig = function(){
            for (var x = 0; x < $scope.SkillDispData.length; x++) {
                $scope.SkillDispData[x].Assoc = $scope.savedConfig[x].Assoc;
                $scope.SkillDispData[x].CommentsRequired = $scope.savedConfig[x].CommentsRequired;
                $scope.SkillDispData[x].ListPriority = $scope.savedConfig[x].ListPriority;
                $scope.SkillDispData[x].Status = $scope.savedConfig[x].Status;
                $scope.SkillDispData[x].UseComments = $scope.savedConfig[x].UseComments;
                $scope.SkillDispData[x].UseComm = $scope.savedConfig[x].UseComm;
                $scope.SkillDispData[x].useSelected[0].sel = $scope.savedConfig[x].useSelected[0].sel;
                $scope.SkillDispData[x].useSelected[1].sel = $scope.savedConfig[x].useSelected[1].sel;
                $scope.SkillDispData[x].yesnos[0].name = $scope.savedConfig[x].yesnos[0].name;
                $scope.SkillDispData[x].yesnos[0].sel = $scope.savedConfig[x].yesnos[0].sel;
                $scope.SkillDispData[x].yesnos[1].name = $scope.savedConfig[x].yesnos[1].name;
                $scope.SkillDispData[x].yesnos[1].sel = $scope.savedConfig[x].yesnos[1].sel;
                $scope.SkillDispData[x].showit = $scope.savedConfig[x].showit;
            }
        };
        $scope.UpdateSkillDisp = function() {
            $scope.showSpinner = true;
            for (var x = 0; x < $scope.SkillDispData.length; x++) {
                $scope.SkillDispData[x].action = "";
                if ($scope.SkillDispData[x].Assoc == true) {
                    // look for it in the old data
                    var foundit = false;
                    for (i = 0; i < $scope.skilloutdata.length; i++) {
                        if ($scope.SkillDispData[x].DispositionID == $scope.skilloutdata[i].DispositionID) {
                            foundit = true;
                            // check properties - if changed MOD else already assoc. do nothing
                            if ($scope.SkillDispData[x].ListPriority != $scope.skilloutdata[i].ListPriority) {
                                $scope.SkillDispData[x].action = "Mod";
                            }
                            if ($scope.SkillDispData[x].UseComments != $scope.skilloutdata[i].UseComments) {
                                $scope.SkillDispData[x].action = "Mod";
                            }
                            if ($scope.SkillDispData[x].CommentsRequired != $scope.skilloutdata[i].CommentsRequired) {
                                $scope.SkillDispData[x].action = "Mod";
                            }
                        }
                    }
                    if (!foundit) {
                        $scope.SkillDispData[x].action = "Add";
                    }
                } else {
                    // not associated now - see if it was prior
                    for (var i = 0; i < $scope.skilloutdata.length; i++) {
                        if ($scope.SkillDispData[x].DispositionID == $scope.skilloutdata[i].DispositionID) {
                            // found - delete now association
                            $scope.SkillDispData[x].action = "Delete";
                        }
                    }
                }
            }
            // go through all dispositions twice, processing their action
            // first pass to delete. Second pass to add
            // Pass 1 delete
            doDeletes();
        };
        var doDeletes = function(){
            var found = false;
            for (var x = 0; x < $scope.SkillDispData.length; x++) {
                if ($scope.SkillDispData[x].action == "Delete" || $scope.SkillDispData[x].action == "Mod") {
                    // delete association
                    found = true;
                    SoapDelete(x);
                    break;
                }
            }
            if(!found){
                doAdds();
            }
        };
        var SoapDelete = function(index){
            var parm = {skillDispositionID: $scope.SkillDispData[index].SkillDispositionID};
            icSOAPServices.icGet("SkillDisposition_Delete", parm).then(
                function (data) { // good
                    for (var x = 0; x < $scope.SkillDispData.length; x++) {
                        if ($scope.SkillDispData[x].action == "Delete" || $scope.SkillDispData[x].action == "Mod") {
                            if ($scope.SkillDispData[x].action == "Delete") {
                                $scope.SkillDispData[x].action = "";
                                break;
                            } else {
                                $scope.SkillDispData[x].action = "Add";
                                break;
                            }
                        }
                    }
                    doDeletes();
                }, function (response) {
                    alert("Failure");
                }
            );

        };
        var doAdds = function() {
            var found = false;
            for (var x = 0; x < $scope.SkillDispData.length; x++) {
                if ($scope.SkillDispData[x].action == "Add" || $scope.SkillDispData[x].action == "Mod") {
                    found = true;
                    SoapAdd(x);
                    break;
                }
            }
            if(!found){
                var nextSkillName = "";
                for (var x = 0; x < $scope.skills.length; x++){
                    $scope.skills[x].Selected = "";
                }
                for (x = 0; x < $scope.skills.length; x++){
                    // find current one
                    if ($scope.skills[x].SkillNo == $scope.skillID){
                        if (x+1 != $scope.skills.length){
                            nextSkillName = $scope.skills[x+1].SkillName;
                            $scope.skills[x + 1].Selected = "selected";
                        }else{
                            nextSkillName = $scope.skills[0].SkillName;
                            $scope.skills[0].Selected = "selected";
                        }
                    }
                }
                $scope.modSkillSelected = nextSkillName;
                $scope.skillSelected();
                $scope.showSpinner = false;
            }
        };
        var SoapAdd = function(index) {
            var parm = {
                skilldisposition: {
                    SkillNo: $scope.SkillDispData[index].SkillNo,
                    DispositionID: $scope.SkillDispData[index].DispositionID,
                    ListPriority: $scope.SkillDispData[index].ListPriority,
                    UseComments: $scope.SkillDispData[index].UseComments,
                    CommentsRequired: $scope.SkillDispData[index].CommentsRequired
                }
            };

            icSOAPServices.icGet("SkillDisposition_Add", parm).then(
                function (data) { // good
                    for (var x = 0; x < $scope.SkillDispData.length; x++) {
                        if ($scope.SkillDispData[x].action == "Add") {
                            $scope.SkillDispData[x].action = "";
                            break
                        }
                    }
                    doAdds();
                }, function (response) {
                    alert("Failure");
                });

        };

        // pass 2 Add
         $scope.showSpinner = false;

    }]);