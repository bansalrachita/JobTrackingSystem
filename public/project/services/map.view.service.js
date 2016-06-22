
(function () {
    angular
        .module("JobTracker")
        .factory("mapService",  MapService);

    var applicantData, skillsData;

    function MapService(chartService, $rootScope, JobService, ApplicationService) {
        var api = {
            clickMap: clickMap,
            getChart: getChart,
            getChart1: getChart1,
            getValidStates: getValidStates
        };
        return api;

        function getChart() {
            chartService.getAggregate($rootScope);
        }

        function getChart1() {
            chartService.getAggregate1($rootScope);
        }

        function getValidStates(jid) {
            var state = [];

                ApplicationService
                    .findApplicantDataForMap(jid)
                    .then(function (response){
                        console.log("MapService ApplicationService findApplicationDataForMap success", jid);
                        var applicantDataFromService = response.data;
                        applicantData = applicantDataFromService["applicantData"];
                        skillsData = applicantDataFromService["skillsData"];
                        angular.forEach(applicantData, function (value, key) {
                            console.log("key : " + key + ", value : " + value.State);
                            if (value.State) {
                                state.push(value.State);
                            }
                        });
                        return state;
                    }, function (err){
                        console.log("MapService ApplicationService findApplicationDataForMap error", jid);
                    });
        }

        function clickMap(state, jid) {
            // console.log("click map " + jid);
            var chartData = [];
            var skillData = [];

            ApplicationService
                .findApplicantDataForMap(jid)
                .then(function (response){
                    console.log("MapService clickMap ApplicationService findApplicationDataForMap success", jid);
                    var applicantDataFromService = response.data;
                    applicantData = applicantDataFromService["applicantData"];
                    console.log(applicantData);
                    angular.forEach(applicantData, function (value, key) {
                        console.log("key : " + key + ", value : " + value.State);
                        if (value.State == state) {
                            chartData.push(value);
                        }
                    });
                    skillsData = applicantDataFromService["skillsData"];
                    angular.forEach(skillsData, function (value, key) {
                        console.log("key : " + key + ", value : " + value.State);
                        if (value.State == state) {
                            skillData.push(value);
                        }
                    });

                    console.log(chartData);
                    console.log(skillData);
                }, function (err){
                    console.log("MapService clickMap ApplicationService findApplicationDataForMap error", jid);
                }).then(function (chartData, skillData) {
                    chartService
                        .setChart1(skillData, $rootScope);
                    chartService
                        .setChart(chartData, $rootScope);
            }, function (err){
                console.log("char service faulted");
            });

            if(skillData.length == 0 || chartData.length == 0){
                chartService
                    .setChart1(skillData, $rootScope);
                chartService
                    .setChart(chartData, $rootScope);
            }


            return {chartData: chartData, chart1Data: skillData};
        }
    }
})();