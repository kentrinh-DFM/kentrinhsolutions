var app = angular.module('myApp', []);


app.config(function($sceDelegateProvider){
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    "http://www.youtube.com/embed/**"
  ]);
})


app.controller('myCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.selected = "about";

    $scope.menu = [
    {
        id: 'about'
    },
    {
        id: 'portfolio'
    }
    ]

     $scope.works = [
    {
        title: 'Budget Scenario Planning',
        src: '//www.youtube.com/embed/dpdc1nmORfg',
        text: 'Indicative Forecasting for budget planning.'
    },
    {
        title: 'GIS Scenario Planning',
        src: '//www.youtube.com/embed/KfigiNUj694',
        text: 'Scenario Facilities Planning using Geospatial Technology.'
    },
    {
        title: 'PowerBI Custom Visualisation',
        src: '//www.youtube.com/embed/lJAmwsBY14Q',
        text: 'Cavity Filling Analysis using PowerBI heatmap custom visualisation.'
    },
    {
        title: 'Tableau Services Analytics Dashboard',
        src: '//www.youtube.com/embed/FARPR9DGBGQ',
        text: 'End-to-end services analysis reporting.'
    }

    ]
    
    $scope.go = function(item){
        $scope.selected = item.id
    }





}])
