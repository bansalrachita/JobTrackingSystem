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
                $scope.chart.value = response.data;

            }, function (err) {
                console.log("ApplicationService aggregateDegreesForJID error");
            });
        chartService.setChart($scope.chart.value);

        console.log("chart", $scope.chart.value);


        ApplicationService
            .aggregateSkillsForJID(vm.jobId)
            .then(function (response) {
                console.log("first time skills rendered :  ApplicationService aggregateSkillsForJID error");
                $scope.chart1.value = response.data;
            }, function (err) {
                console.log("ApplicationService aggregateSkillsForJID error");
            });

        console.log("chart1", $scope.chart1.value);

        $scope.$on("chart-updated", function (event, data) {
            console.log(data);
            if (data && data === true) {
                // $http.get("data/chart.json")
                //     .then(function (response) {
                //        $scope.chart.value = response.data;
                //     });
                // $scope.$apply($scope.chart.value = ApplicationService
                //     .aggregateDegreesForJID(vm.jobId));
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
                // console.log("hi i am in apply");
                $scope.$apply($scope.chart.value = data);
            }
        });

        $scope.$on("chart1-updated", function (event, data) {
            console.log(data);
            if (data && data === true) {
                // $http.get("data/skills")
                //     .then(function (response) {
                //         $scope.chart1.value = response.data;
                //     });

                // $scope.$apply($scope.chart1.value = ApplicationService
                //     .aggregateSkillsForJID(vm.jobId));

                ApplicationService
                    .aggregateSkillsForJID(vm.jobId)
                    .then(function (response) {
                        console.log("ApplicationService aggregateSkillsForJID error");
                        $scope.chart1.value = response.data;
                    }, function (err) {
                        console.log("ApplicationService aggregateSkillsForJID error");
                    });
            }
            else if (data) {
                // console.log("hi i am in apply 1");
                $scope.$apply($scope.chart1.value = data);
            }
        });
    }
})();

