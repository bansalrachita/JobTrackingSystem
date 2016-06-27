
(function () {
    angular
        .module("JobTracker")
        .factory("mapService",  MapService);

    var applicantData, skillsData;

    function MapService(chartService, $rootScope, JobService, ApplicationService) {
        var api = {
            // clickMap: clickMap,
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
    }
})();