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
            setChart1:setChart1,
            getAggregate: getAggregate,
            getAggregate1: getAggregate1,
            broadCastScope: broadCastScope
        };

        function setChart(value, $rootScope) {
            donutData.value = value;
            if ($rootScope) {
                broadCastScope($rootScope);
            }

        }

        function setChart1(value, $rootScope) {
            if ($rootScope) {
                broadCastChart1Scope($rootScope,value);
            }

        }

        function broadCastChart1Scope($rootScope,value) {
            if ($rootScope) {
                console.log(value);
                $rootScope.$broadcast("chart1-updated", value);
            }
        }

        function broadCastScope($rootScope) {
            if ($rootScope) {
                console.log(donutData.value);
                $rootScope.$broadcast("chart-updated", donutData.value);
            }
        }

        function getAggregate1($rootScope) {
            console.log("aggregated 1");
            $http.get("data/skills")
                .then(function (response) {
                    broadCastChart1Scope($rootScope, response.data);
                });
        }

        function getAggregate($rootScope) {
            console.log("aggregated");
            $http.get("data/chart.json")
                .then(function (response) {
                    donutData.value = response.data;
                    broadCastScope($rootScope);
                });
        }

    }


})();
