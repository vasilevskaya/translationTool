var app = angular.module('myApp', ['ngAnimate']);
app.controller('myCtrl',  ['$scope', '$http', '$sce','$q', '$anchorScroll', '$location','translateService','dataService',
    function ($scope, $http, $sce, $q,$anchorScroll, $location, translateService,dataService)
     {
        dataService.retrieveData($scope, $q);

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

         $scope.change = function(id){
            var elem = document.querySelector("#"+id);
            if($scope.filtered || ($scope.filtered.length==1 && $scope.filtered[0].word !== id)){

               $scope.newWord = {word: "",translation:"", definition: "", sentence: ""};
              }
         }

         $scope.findTranslation =function(word){
             if($scope.newWord.word!='')
                dataService.addNewWord($scope, $q, $scope.newWord);
             else
                translateService.translate($scope, $q, $http, $scope.search);
         }


     $scope.deleteRow = function(word){dataService.deleteRow($scope, $q, word);}

     $scope.gotoAnchor = function(x) {
      var newHash = 'anchor' + x;
      if ($location.hash() !== newHash) {
        $location.hash('anchor' + x);
      } else {
        $anchorScroll();
      }
    };
    }]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.service('translateService', function() {

    this.translate = function($scope, $q, $http, word){
        translate(word, $http, $q).then(
            succes=>{
                $scope.newWord = {word: word,translation:succes.data, definition: "", sentence: ""};
            },
            error=>{console.log(error);}
        );
    }
});


app.service('dataService', function() {
    
    this.retrieveData = function($scope, $q){
          getWords($q).then(
         data => {
            $scope.records = data;// Success!
        }, reason => {
            console.log(reason); // Error!
        }    );
    }

     this.deleteRow = function ($scope,$q, word) {
        deleteWord($q, word).then(
                    succes=>{
                        var index = $scope.records.find((record)=>{return record.word == word;});
                        var el=$scope.records[index];
                        index.isHiden = true;
                        $scope.newWord = {word: "",translation:"", definition: "", sentence: ""};
                        $scope.records.splice(index, 1); 
                        $scope.search='';
                    },
                    error=>{
                        console.log(error);
                    }
                );
    }

    this.addNewWord = function ($scope,$q, word) {
        addNewWord($q, word).then(
                    succes=>{
                        $scope.records.push($scope.newWord);
                        var elementId = $scope.newWord.word;
                        $scope.newWord = {word: "",translation:"", definition: "", sentence: ""};
                        $scope.search='';
                        $scope.gotoAnchor(elementId);
                    },
                    error=>{
                        console.log(error);
                    }
                );
    }
});