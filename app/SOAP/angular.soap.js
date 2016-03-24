angular.module('angularSoap', [])

	.factory("$soap",['$q',function($q){
		return {
			post: function(url, action, params){
				var deferred = $q.defer();

				//Create SOAPClientParameters
				var soapParams = new SOAPClientParameters();
				for(var param in params){
					soapParams.add(param, params[param]);
				}

				//Create Callback
				var soapCallback = function(e, extra){
					if(e == null || e.constructor.toString().indexOf("function Error()") != -1){
						var resp = new XMLSerializer().serializeToString(extra);
//						alert('error received :' + resp);
						var errorResp = {"error" : resp};
						deferred.reject(errorResp);
					} else {
						deferred.resolve(e);
					}
				};

				SOAPClient.invoke(url, action, soapParams, true, soapCallback);
				return deferred.promise;
			},
			setCredentials: function(username, password){
				SOAPClient.username = username;
				SOAPClient.password = password;
			}
		}
	}]);
