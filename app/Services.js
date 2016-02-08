/**
 *
 */
angular.module('SkyboxApp')

    .factory("icSOAPServices",function icSOAPServicesFactory($soap,$http){
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
        var base_url = "https://login.incontact.com/inSideWS/insidews.asmx";
        return {
            icGet: function(action, parms){
                return $soap.post(base_url,action,parms);
            },
            token:function(userData){
//                var myurl = "https://api.incontact.com/InContactAuthorizationServer/Token";
 //               var user = "mladewski@skyboxcommunications.com";
//                var pw = "BR@ves2020";
//                var vendor = "Skybox_communications";
//                var BU = "4594585";
//                var application = "Skybox_mobil";
                var myurl = "https://api.incontact.com/InContactAuthorizationServer/Token";
                var user = userData.name;
                var pw = userData.pass;
                var vendor = userData.vendName;
                var BU = userData.BusUnit;
                var application = userData.appName;

                var AuthCode = Base64.encode(application + "@" + vendor + ":" + BU);
                var mydata = {
                    "grant_Type":"password",
                    "username":user,
                    "password":pw,
                    "scope":"AgentApi AdminApi RealTimeApi"
                };
                var config = {
                    method:'POST',
                    url:myurl,
                    data:mydata,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization':'Basic ' + AuthCode
                    }
                };
                return $http(config);
            }

        }
    });