/**
 * Created by rachita on 5/31/16.
 */

(function () {
    angular
        .module("Map")
        .controller("donutchartController", ChartController);

    function ChartController($scope, $rootScope, $http, chartService) {
        $rootScope.chart = {value: null};

        $http.get('data/chart.json').then(function (response) {
            $rootScope.chart = {
                value: response.data
            }
            chartService.setChart($rootScope.chart);
            console.log("chart", $rootScope.chart.value);
        }, function (err) {
            throw err;
        });
        
    }
})();

