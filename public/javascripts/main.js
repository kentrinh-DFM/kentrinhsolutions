var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.selected = "about";

    $scope.menu = [
    {
        id: 'about'
    },
    {
        id: 'porfolio'
    }
    ]
    
    $scope.go = function(item){
        $scope.selected = item.id
    }


}])