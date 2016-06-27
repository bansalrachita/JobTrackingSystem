(function () {
    angular
        .module("JobTracker")
        .controller("JobEditController", JobEditController);

    function JobEditController($scope, $http, $stateParams, $location, JobService, ApplicationService, ExternalDataService) {
        var vm = this;
        vm.userId = $stateParams.uid;
        vm.jobId = $stateParams.jid;

        console.log("inside JobEditController for userId=" +
            vm.userId + " and jobId=" + $scope.jobId);


        function init() {
            vm.choices = [];
            vm.selectedState = "";

            JobService
                .findJobByJId(vm.jobId)
                .then(function (response) {
                    console.log("JobService findJobByJID ", vm.jobId);
                    vm.job = response.data;
                    for (var i in vm.job.skills) {
                        vm.choices.push({name: vm.job.skills[i]});
                    }
                    if(vm.job.state){
                        vm.selectedState = vm.job.state;
                    }
                    // console.log(vm.choices);
                }, function (err) {
                    console.log("JobService findJobByJID err");
                });

            ExternalDataService
                .getStates()
            // $http.get('data/us-states.json')
                .then(function (response) {
                vm.states = response.data;
                angular.forEach(vm.states, function (key, value) {
                    if (key.name == vm.selectedState) {
                        console.log(key);
                        vm.selectedState = vm.states[value];
                    }
                });

            });
        }

        init();

        vm.addNewChoice = function () {
            vm.choices.push({name: null});
        };

        vm.removeChoice = function () {
            var lastItem = vm.choices.length - 1;
            vm.choices.splice(lastItem);
        };

        vm.updateJob = function (newJob) {
            console.log("update website with newJob ", newJob);
            vm.job.skills = [];
            if(vm.choices){
                angular.forEach(vm.choices, function (key, value) {
                    vm.job.skills.push(key.name);
                });
            }
            if(vm.selectedState.name){
                vm.job.state = vm.selectedState.name;
            }
            JobService
                .updateJob(newJob)
                .then(function (response) {

                    vm.success = "Jobs Saved!";
                    $location.path('/dashboard/' + vm.userId + '/jobs');
                }, function (err) {
                    vm.error = "error";
                });
        };

        vm.deleteJob = function (job) {
            console.log("delete jobId=", vm.jobId);

            JobService
                .deleteJob(vm.jobId)
                .then(function (success) {
                    console.log("JobEditController JobService deleteJob success");
                    return vm.jobId;
                }, function (err) {
                    console.log("JobEditController JobService deleteJob err");
                }).then(function (jid) {
                ApplicationService
                    .deleteApplication(vm.jobId)
                    .then(function (success) {
                        console.log("JobEditController ApplicationService deleteApplication success");
                        $location.path('/dashboard/' + vm.userId + '/jobs');
                    }, function (err) {
                        console.log("JobEditController ApplicationService deleteApplication err");
                    });

            });


        }
    }

})();


