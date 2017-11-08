window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
var db;
var setUp = false;

function init($q) {
    var deferred = $q.defer();

    if(setUp) {
        deferred.resolve(true);
        return deferred.promise;
    }
        
    var openRequest = window.indexedDB.open("dictionaryDB",2);
    
    openRequest.onerror = function(e) {
        console.log("Error opening db");
        console.dir(e);
        deferred.reject(e.toString());
    };

    openRequest.onupgradeneeded = function(e) {
        var db = e.target.result;
        var objectStore = db.createObjectStore('dictionaryDB', { keyPath: 'word' });  
        objectStore.createIndex('word', 'word', { unique: true });
    };

    openRequest.onsuccess = function(e) {
        db = e.target.result;
        db.onerror = function(event) {
            deferred.reject("Database error: " + event.target.errorCode);
        };
        setUp=true;
        deferred.resolve(true);
    };  

        return deferred.promise;
    }


function compileRecords(){
    var records = new Array();
    var d = JSON.stringify(translatedWords);
    var dictionary = JSON.parse(d);
    dictionary.forEach(function (word) {
    records.push({ word: word.back[0].content, translation:word.back[3].content, definition: word.back[1].content, sentence: word.back[2].content });
      }, this);
      return records;
}

 function populateData($q){

    var deferred = $q.defer();

         console.log("populateData");
         var words = compileRecords();
        var transaction = db.transaction(['dictionaryDB'], 'readwrite');
        var objectStore = transaction.objectStore('dictionaryDB');
        for(i = 0; i < words.length ; i++) {
        var request = objectStore.put(words[i]);
        }

        transaction.oncomplete = function(event) {
            deferred.resolve("Data in DB");
        };

    return deferred.promise;

}

 function getWords($q) {
        var deferred = $q.defer();
        
        init($q).then(()=> populateData($q)).then(function() {
        var data =[];
        var indexName='';
        var keyRangeValue = null;
        indexName = 'word';
   
        var transaction = db.transaction(['dictionaryDB'], 'readonly');
        var objectStore = transaction.objectStore('dictionaryDB');
    

        var countRequest = objectStore.count();
        countRequest.onsuccess = function() {
        console.log(countRequest.result);
        };

        objectStore.index(indexName).openCursor(keyRangeValue).onsuccess = function(event) {
        var cursor = event.target.result;
            if(cursor) {
                data.push({ word: cursor.value.word, definition: cursor.value.definition, sentence: cursor.value.sentence, translation:cursor.value.translation, isHiden:false });
        
                cursor.continue();
            } else {
            console.log('Entries all displayed.');
            console.log(data[0].word);
            }
        };

        transaction.oncomplete = function(event) {
                    deferred.resolve(data);
            };
        
        });
        return deferred.promise;
    }

function addNewWord($q, word){
    
    var deferred = $q.defer();

    var transaction = db.transaction(["dictionaryDB"], "readwrite");

    transaction.oncomplete = function(event) {
        console.log("All done!");
        
    };

    transaction.onerror = function(event) {
      console.log(event.content);
      deferred.reject(e.toString());
    };

    var objectStore = transaction.objectStore("dictionaryDB");
        var request = objectStore.add(word);
        request.onsuccess = function(event) {
        var data = event.target.result;
        deferred.resolve(data);
            
     };

    return deferred.promise;
}

function deleteWord($q, word){
    var deferred = $q.defer();
    
    var request = db.transaction(["dictionaryDB"], "readwrite")
                .objectStore("dictionaryDB")
                .delete(word);
    request.onsuccess = function(event) {
        console.log(word+' has gone');
        deferred.resolve(true);
    };

    return deferred.promise;
    
}


function lookInApi(word){
    return  {
        word: word,translation:"test translation", definition: "test definition", sentence: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet doloremque, ad repellat? Voluptatibus facere unde aliquam consequuntur quis optio modi eius pariatur dignissimos delectus nisi fugit, tenetur minus nesciunt ipsa."
    }
}
