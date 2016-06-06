/**
 * Created by rachita on 5/31/16.
 */

(function () {
    angular
        .module('Map')
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'pages/home.html',
                controller: 'homeCtrl',
                controllerAs: "model"
            })
            .when('/pages/map', {
                templateUrl: 'maps/map.html',
                controller: 'mapCtrl',
                controllerAs: "model"
            })
            .when('/pages/tree', {
                templateUrl: 'treegraph/tree.html',
                controller: 'treeCtrl',
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: '/'
            });
        //remove hashbang
        // $locationProvider.html5Mode(false);
    }
})();
