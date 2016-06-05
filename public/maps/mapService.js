/**
 * Created by rachita on 6/1/16.
 */

(function () {
    angular
        .module("Map")
        .factory("mapService", MapService);

    var applicantData, skillsData;
    //getting static data for application for 1 ID
    applicantData = [
        {
            "State": "Massachusetts",
            "City": "Boston",
            "label": "Masters",
            "value": 4
        },
        {
            "label": "Masters of Science",
            "State": "Massachusetts",
            "City": "Cambridge",
            "value": 3
        },
        {
            "label": "Bachelor of science",
            "State": "California",
            "City": "San Fransico",
            "value": 1
        },
        {
            "label": "Master of science",
            "State": "Wisconsin",
            "value": 20
        },
        {
            "label": "Massachusetts",
            "City": "Boston",
            "degree": "Masters",
            "value": 4
        },
        {
            "label": "Masters of Science",
            "State": "Massachusetts",
            "City": "Cambridge",
            "value": 3
        },
        {
            "label": "Bachelor of science",
            "State": "California",
            "City": "San Fransico",
            "value": 1
        },
        {
            "label": "Bachelor of science",
            "State": "Wisconsin",
            "value": 4
        }
    ];

    skillsData = [
        {
            "State": "Massachusetts",
            "City": "Boston",
            "label": "Hadoop",
            "value": 4
        },
        {
            "label": "Java",
            "State": "Massachusetts",
            "City": "Cambridge",
            "value": 3
        },
        {
            "label": "Java",
            "State": "California",
            "City": "San Fransico",
            "value": 1
        },
        {
            "label": "C++",
            "State": "Wisconsin",
            "value": 20
        },
        {
            "label": "Massachusetts",
            "City": "Boston",
            "degree": "C++",
            "value": 4
        },
        {
            "label": "MapReduce",
            "State": "Massachusetts",
            "City": "Cambridge",
            "value": 3
        },
        {
            "label": "Hadoop",
            "State": "California",
            "City": "San Fransico",
            "value": 1
        },
        {
            "label": "Hadoop",
            "State": "Wisconsin",
            "value": 4
        }
    ];

    function MapService(chartService, $rootScope) {
        var api = {
            clickMap: clickMap,
            getChart: getChart,
            getChart1: getChart1,
            getPoints: getPoints
        };
        return api;

        function getChart() {
            chartService.getAggregate($rootScope);
        }

        function getChart1() {
            chartService.getAggregate1($rootScope);
        }

        function getPoints() {
            var state = [];
            angular.forEach(applicantData, function (value, key) {
                console.log("key : " + key + ", value : " + value.State);
                if (value.State) {
                    state.push(value);
                }
            });
            return state;
        }

        function clickMap(state, $scope) {
            var chartData = [];
            var skillData = [];
            angular.forEach(applicantData, function (value, key) {
                console.log("key : " + key + ", value : " + value.State);
                if (value.State == state) {
                    chartData.push(value);
                }
            });

            angular.forEach(skillsData, function (value, key) {
                console.log("key : " + key + ", value : " + value.State);
                if (value.State == state) {
                    skillData.push(value);
                }
            });

            console.log(chartData);
            console.log(skillData);
            chartService.setChart(chartData, $rootScope);
            chartService.setChart1(skillData, $rootScope);

            return {chartData: chartData, chart1Data: skillData};
        }
    }
})();