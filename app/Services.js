/**
 *
 */
angular.module('SkyboxApp')
     .factory('AuthenticationService',
        ['$base64','$http', '$rootScope', '$timeout', '$cookieStore',
            function ($base64, $http,  $rootScope, $timeout, $cookieStore) {
                var service = {};
                var globalData = {};

                service.Login = function (username, password) {

                     var config = {
                        method:'POST',
                        url:'http://localhost:8080/SkyboxProxy/Verify/' + username,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization' : $base64.encode(username + ':' + password),
                            'Accept': 'application/json'
                        }
                    };
                    console.log(config);
                    return $http(config);

                };
                service.UpdatePW = function (username, password){

                    var config = {
                        method:'POST',
                        url:'http://localhost:8080/SkyboxProxy/UpdatePW/' + username,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization' : $base64.encode(username + ':' + password),
                            'Accept': 'application/json'
                        }
                    };
                    console.log($base64.decode(config.headers.Authorization));
                    return $http(config);
                };
                service.SetCredentials = function (username, password) {

                     var authdata = $base64.encode(username + ':' + password);

                    $rootScope.globals = {
                        currentUser: {
                            username: username,
                            authdata: authdata
                        }
                    };
                    globalData = $rootScope.globals;
                    //                  $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                    $cookieStore.put('globals', $rootScope.globals);
                };

                service.ClearCredentials = function () {
                    $rootScope.globals = {};
                    $cookieStore.remove('globals');
 //                   $http.defaults.headers.common.Authorization = 'Basic ';
                };
                service.GetCredentials = function() {
                    $rootScope.globals = globalData;
                    return $rootScope.globals;
                };
                service.GetBUData = function(BU){
                    username =  globalData.currentUser.username;
                    var config = {
                        method: "GET",
                        url: 'http://localhost:8080/SkyboxProxy/Get_BU_Data/' + username + '/' + BU,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        }

                    };
                    return $http(config);
                };
                service.SaveBUData = function(BU, BU_DATA){
                    username =  globalData.currentUser.username;
                    var config = {
                        method: "POST",
                        url: 'http://localhost:8080/SkyboxProxy/Save_BU_Data/' + username + '/' + BU,
                        data:BU_DATA,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }

                    };
                    return $http(config);
                };
                return service;
            }])

    .factory("icSOAPServices",function icSOAPServicesFactory($soap,$http){
         var proxyAdd = "http://tools.skybox.tech:8080";
  //     var proxyAdd = "http://localhost:8080";
        var Base64 = {
            // private property
            _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            // public method for encoding
            encode : function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = Base64._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                        Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

                }

                return output;
            },
            // private method for UTF-8 encoding
            _utf8_encode : function (string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            }

        };
     //  var base_url = "https://login.incontact.com/inSideWS/insidews.asmx";
        var base_url = "http://localhost:8080";
        return {
            icGet: function(action, parms){
                return $soap.post(proxyAdd,action,parms);
            },
            token:function(){
                var UserName = "chester.ladewski@skyboxcommunications.com";
                var UserPassword = "colleeN101";
                var SecurityToken = "KiYOWIm3oyA7XsI0idoWktFah";
                var ConsumerKey = "3MVG9fMtCkV6eLhcL8onJchoL4FLP4YrN8oQdgDm80YQEBGzmpws17NW2EexNUuTNU1dRUfKsIy1t040CNYI3";
                var SecretKey = "3334220952769447215";
                var requestURL = "https://login.salesforce.com/services/oauth2/token";
                var config = {
                    method:'POST',
                    url:requestURL,
                    data:
                    "&grant_type=password" +
                    "&client_id="+ ConsumerKey +
                    "&client_secret=" + SecretKey +
                    "&password=" + UserPassword + SecurityToken +
                    "&username=" + UserName
                    ,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
//                        'Access-Control-Allow-Origin' : '*',
//                        'Access-Control-Allow-Headers' : 'X-Requested-with',
//                        'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE',
                        'Accept': '*/*'
                    }
                };
                return $http(config);
            } ,
            SFgetIt:function(selectStmt,tokenRtn){
                var config = {
                    method: 'GET',
                    url: tokenRtn.instance_url + "/services/data/v25.0/query?q=" + encodeURIComponent(selectStmt),
                    headers: {
                        'Authorization': tokenRtn.token_type + " " + tokenRtn.access_token,
                        //                       'Access-Control-Allow-Origin' : '*',
                        //                      'Access-Control-Allow-Headers' : 'X-Requested-with'},
                        //                      'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE',
                        Accept: 'application/json'}
                    };
                return  $http(config);
            },
            SFProxy:function(BusinessUnit){
                var config = {
                    method: 'GET',
                    url: proxyAdd + "/SkyboxProxy/Updater/SFlookup/" + BusinessUnit,
                    headers: {Accept: 'application/json'}
                };
                return $http(config);
            },
            SFListProxy:function(){
                var config = {
                    method: 'GET',
                    url: proxyAdd + "/SkyboxProxy/Updater/SFlookup" ,
                    headers: {Accept: 'application/json'}
                };
                return $http(config);
            },
            ICToken:function(Authkey,user, pw){
                var accessToken = 'Basic ' + Base64.encode(Authkey);
                var parms = '?grant_type=password&username=' + user + '&password=' + pw + '&scope=AgentApi RealTimeApi AdminApi CustomApi AuthenticationApi PatronApi';
                parms = Base64._utf8_encode(parms);

                var config = {
                    method:'POST',
//                    url:'https://api.incontact.com/InContactAuthorizationServer/Token',
                    url: proxyAdd + '/SkyboxProxy/restful/token/junk',
                    data:{
                        grant_Type:"password",
                        username:user,
                        password:pw,
                        scope:'AgentApi RealTimeApi AdminApi'
                    },
                    headers: {
                        'content-type':'application/json',
                        accept:'application/json',
                        authorization:accessToken}
                };

                 return $http(config);
            },
            ICGET:function(token,ExtURL){
                var accessBearer = 'Bearer ' + token.access_token;
                var URL = token.resource_server_base_uri + Base64._utf8_encode(ExtURL);
                var config = {
                    method:'GET',
                    url:proxyAdd + '/SkyboxProxy/restful/ICGET/' + URL,
                    headers: {
                        'content-type':'application/json',
                        accept:'application/json',
                        authorization:accessBearer
                    }
                 };
                return $http(config);
            },
            ICPUT:function(token,ExtURL,dataParms){
                var accessBearer = 'Bearer ' + token.access_token;
                var URL = token.resource_server_base_uri + ExtURL;
                var config = {
                    method:'PUT',
                    url:proxyAdd + '/SkyboxProxy/restful/ICPUT/' + URL,
                    data: dataParms,
                    headers: {
                        'content-type':'application/json',
                        accept:'application/json',
                        authorization:accessBearer
                    }
                };
                return $http(config);
            },
            ICPOST:function(token,ExtURL,dataParms){
                var accessBearer = 'Bearer ' + token.access_token;
                var URL = token.resource_server_base_uri + ExtURL;
                var config = {
                    method:'POST',
                    url:proxyAdd + '/SkyboxProxy/restful/ICPOST/' + URL,
                    data: dataParms,
                    headers: {
                        'content-type':'application/json',
                        accept:'application/json',
                        authorization:accessBearer
                    }
                };
                return $http(config);
            }
        }
    });