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
                templateUrl: 'maps/map.html',
                controller: 'mapCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        //remove hashbang
        // $locationProvider.html5Mode(false);
    }
})();
