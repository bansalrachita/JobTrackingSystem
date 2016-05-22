/**
 * Created by rachita on 5/21/16.
 */
var app = angular.module('Test', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'pages/home.html',
                    controller: 'HomeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource',
function($scope,$resource){
}])