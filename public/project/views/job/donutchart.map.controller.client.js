(function () {
    angular
        .module("JobTracker")
        .controller("donutChartController", donutChartController);

    function donutChartController($scope, $http, chartService, $stateParams, ApplicationService) {
        var vm = this;
        vm.userId = $stateParams.uid;
        vm.jobId = $stateParams.jid;

        console.log("inside donutChartController for uid=" + vm.userId + " with " + vm.jobId);


        $scope.chart = {
            value: null
        };

        $scope.chart1 = {
            value: null
        };

        // if(vm.jobId == 123){
        ApplicationService
            .aggregateDegreesForJID(vm.jobId)
            .then(function (response) {
                console.log("first time chart rendered : aggregateDegreesForJID success ");
                var degreeAgg = response.data;
                return degreeAgg;
            }, function (err) {
                console.log("ApplicationService aggregateDegreesForJID error");
            }).then(function (degreeAgg) {
            $scope.chart.value = degreeAgg;
            chartService.setChart($scope.chart.value);
            console.log("chart : ", $scope.chart.value);
        }, function (err) {
            console.log("chartService aggregateDegreesForJID error");
        });


        ApplicationService
            .aggregateSkillsForJID(vm.jobId)
            .then(function (response) {
                console.log("first time skills rendered :  ApplicationService aggregateSkillsForJID");
                var skillsAgg = response.data;
                return skillsAgg;
            }, function (err) {
                console.log("ApplicationService aggregateSkillsForJID error");
            }).then(function (skillsAgg) {
            $scope.chart1.value = skillsAgg;
            chartService.setChart1($scope.chart1.value);
            console.log("setChart1 called : ", $scope.chart1.value);
        });

        $scope.$on("chart-updated", function (event, data) {
            console.log(data);
            if (data && data === true) {
                ApplicationService
                    .aggregateDegreesForJID(vm.jobId)
                    .then(function (response) {
                        console.log("ApplicationService aggregateDegreesForJID success ");
                        $scope.chart.value = response.data;

                    }, function (err) {
                        console.log("ApplicationService aggregateDegreesForJID error");
                    });

            }
            else if (data) {
                $scope.$apply($scope.chart.value = data);
            }
        });

        $scope.$on("chart1-updated", function (event, data) {
            console.log(data);
            if (data && data === true) {
                ApplicationService
                    .aggregateSkillsForJID(vm.jobId)
                    .then(function (response) {
                        console.log("ApplicationService aggregateSkillsForJID");
                        $scope.chart1.value = response.data;
                    }, function (err) {
                        console.log("ApplicationService aggregateSkillsForJID error");
                    });
            }
            else if (data) {
                $scope.$apply($scope.chart1.value = data);
            }
        });
    }
})();

