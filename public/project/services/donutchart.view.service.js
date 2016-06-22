
(function () {
    angular
        .module("JobTracker")
        .factory("chartService", ['$http', ChartService]);

    function ChartService($http) {
        return {
            setChart: setChart,
            setChart1: setChart1,
            getAggregate: getAggregate,
            getAggregate1: getAggregate1,
            broadCastScope: broadCastScope
        };

        function setChart(value, $rootScope) {
            if ($rootScope) {
                broadCastScope($rootScope,value);
            }

        }

        function setChart1(value, $rootScope) {
            if ($rootScope) {
                broadCastChart1Scope($rootScope, value);
            }

        }

        function broadCastChart1Scope($rootScope, value) {
            if ($rootScope) {
                console.log(value);
                $rootScope.$broadcast("chart1-updated", value);
            }
        }

        function broadCastScope($rootScope, value) {
            if ($rootScope) {
                $rootScope.$broadcast("chart-updated", value);
            }
        }

        function getAggregate1($rootScope) {
            console.log("aggregated 1");
            if ($rootScope) {
                broadCastChart1Scope($rootScope, true);
            }
        }

        function getAggregate($rootScope) {
            console.log("aggregated");
            if ($rootScope) {
                broadCastScope($rootScope, true);
            }
        }

    }


})();
