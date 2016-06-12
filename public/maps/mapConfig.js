/**
 * Created by rachita on 5/31/16.
 */

(function () {
    angular
        .module('Map')
        .config(['$stateProvider', '$urlRouterProvider',Config]);

    function Config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url:'/',
                templateUrl: '/pages/home.html',
                // controller: 'homeCtrl',
                // controllerAs: "model"
            })
            .state('home.map', {
                url:'/pages/map',
                templateUrl: 'maps/map.html',
                controller: 'mapCtrl',
                controllerAs: "model"
            })
            .state('home.tree', {
                url: '/pages/tree',
                templateUrl: 'treegraph/tree.html',
                controller: 'treeCtrl',
                controllerAs: "model"
            });

        $urlRouterProvider.otherwise('/');
            // .otherwise({
            //     redirectTo: '/'
            // });
    }
})();
