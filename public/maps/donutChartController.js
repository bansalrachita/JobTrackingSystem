/**
 * Created by rachita on 5/31/16.
 */

(function () {
    angular
        .module("Map")
        .controller("donutchartController", ChartController);

    function ChartController($scope,$http){
        $http.get('data/chart.json').then(function(response){
            $scope.chart = {
                value: response.data
            }
            console.log("chart", $scope.chart.value);
        }, function (err) {
            throw err;
        });

    }
})();

