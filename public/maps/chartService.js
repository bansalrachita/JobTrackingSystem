/**
 * Created by rachita on 6/1/16.
 */

(function () {
    angular
        .module("Map")
        .factory("chartService", ['$http', ChartService]);

    function ChartService($http) {

        var donutData = {
            value: null
        };

        return {
            donutData: donutData,
            setChart: setChart,
            getAggregate: getAggregate,
            broadCastScope:broadCastScope
        };

        function setChart(value, $rootScope) {
            donutData.value = value;
            // console.log($rootScope);
            broadCastScope($rootScope);

        }

        function broadCastScope($rootScope){
            if ($rootScope) {
                $rootScope.$broadcast("chart-updated", donutData.value);
            }
        }

        function getAggregate($rootScope){
            console.log("aggregated");
            $http.get("data/chart.json")
                .then(function(response) {
                    donutData.value = response.data;
                    broadCastScope($rootScope);
                });
        }

    }


})();
