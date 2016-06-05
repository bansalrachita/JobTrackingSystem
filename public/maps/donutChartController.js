/**
 * Created by rachita on 5/31/16.
 */

(function () {
    angular
        .module("Map")
        .controller("donutChartController", ChartController);

    function ChartController($scope, $http, chartService) {
        $scope.chart = {
            value: null
        };

        $scope.chart1 = {
            value: null
        }

        $http.get('data/chart.json').then(function (response) {
            $scope.chart = {
                value: response.data
            }
            chartService.setChart($scope.chart.value);
            console.log("chart", $scope.chart.value);
        }, function (err) {
            throw err;
        });

        $http.get('data/skills').then(function (response) {
            $scope.chart1 = {
                value: response.data
            }
            console.log("chart1", $scope.chart1.value);
        }, function (err) {
            throw err;
        });

        $scope.$on("chart-updated", function (event, data) {
            console.log(data);
            if (data) {
                console.log("hi i am in apply");
               $scope.$apply($scope.chart.value = data);
            }
            console.log('trying to update!');
        });

        $scope.$on("chart1-updated", function (event, data) {
            console.log(data);
            if (data) {
                console.log("hi i am in apply 1");
                $scope.$apply($scope.chart1.value = data);
            }
            console.log('trying to update 1!');
        });
    }
})();

