function translate(word, $http, $q) {
        var deferred = $q.defer();
        
        getToken($http, $q).then(
            accessToken=>{
                getDataFromTranslationApi($http, $q, accessToken, word).then(
                    succes=>{
                        deferred.resolve(succes);
                    },
                    error=>{
                        deferred.reject(error);
                    }
                );

            },
            error=>{
                deferred.reject(error);
            }
        );
        return deferred.promise;
    }

function getDataFromTranslationApi($http, $q, accessToken, word){
     var deferred = $q.defer();

       console.log(accessToken.data.toString());
                     var config = {
                         params:{
                            appId:'Bearer '+ accessToken.data,
                            from: "en",
                            to: "ru",
                            text: word,
                         }
                     };

                $http.get('https://api.microsofttranslator.com/V2/Http.svc/Translate', config).then(
                     succes=>{
                         console.log(succes);
                         deferred.resolve(succes);
                         },
                     error=>{
                         console.log(error);
                deferred.reject(error);
                         
                          }
                  );
    return deferred.promise;
}

function getToken($http, $q){
    var deferred = $q.defer();
    $http.post('https://api.cognitive.microsoft.com/sts/v1.0/issueToken?Subscription-Key=93d650aaa05544f6b0d451b9a8548f44').then(
        succes=>{
            deferred.resolve(succes);
        },
        error=>{
            deferred.reject(error);
        }
    );
    return deferred.promise;
}