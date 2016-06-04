/**
 * Created by rachita on 6/1/16.
 */

(function () {
    angular
        .module("Map")
        .factory("mapService", MapService);

    var applicantData;
    //getting static data for application for 1 ID
    applicantData = [
        {
            "State": "Massachusetts",
            "City": "Boston",
            "degree": "Masters",
            "value": 4
        },
        {
            "degree": "Masters of Science",
            "State": "Massachusetts",
            "City": "Cambridge",
            "value": 3
        },
        {
            "degree": "Bachelor of science",
            "University": "California State University",
            "State": "California",
            "City": "San Fransico",
            "value": 1
        },
        {
            "degree": "Bachelor of science",
            "State": "Wisconsin",
            "value": 0
        },
        {
            "State": "Massachusetts",
            "City": "Boston",
            "degree": "Masters",
            "value": 4
        },
        {
            "degree": "Masters of Science",
            "State": "Massachusetts",
            "City": "Cambridge",
            "value": 3
        },
        {
            "degree": "Bachelor of science",
            "State": "California",
            "City": "San Fransico",
            "value": 1
        },
        {
            "degree": "Bachelor of science",
            "University": "University of Wisconsin Maddison",
            "State": "Wisconsin",
            "value": 0
        }
    ];

    function MapService(chartService, $rootScope) {
        var api = {
            clickMap: clickMap,
            getCount: getCount
        };
        return api;
        
        function getCount() {
            chartService.getAggregate($rootScope);
        }

        function clickMap(state, $scope) {
            var chartData = [];

            angular.forEach(applicantData, function (value, key) {
                console.log("key : " + key + ", value : " + value.State);
                if (value.State == state) {
                    chartData.push(value);
                }
            })

            console.log("map service completed : " + chartData);
            chartService.setChart(chartData, $rootScope);

            return {data: chartData, value: true};
        }
    }
})();