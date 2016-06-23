(function () {
    angular
        .module("JobTracker")
        .controller("JobEditController", JobEditController);

    function JobEditController($scope, $http, $stateParams, $location, JobService, ApplicationService) {
        var vm = this;
        vm.userId = $stateParams.uid;

        vm.jobId = $stateParams.jid;

        console.log("inside JobEditController for userId=" +
            vm.userId + " and jobId=" + $scope.jobId);


        function init(){
            JobService
                .findJobByJId(vm.jobId)
                .then(function (response){
                    console.log("JobService findJobByJID ", vm.jobId);
                    vm.job = response.data;
                    vm.choices = vm.job.skills;
                }, function (err){
                    console.log("JobService findJobByJID err");
                });
        }
        init();

        vm.addNewChoice = function () {
            var newItemNo = vm.choices.length + 1;
            vm.choices.push('');
        };

        vm.removeChoice = function () {
            var lastItem = vm.choices.length - 1;
            vm.choices.splice(lastItem);
        };

        vm.updateJob = function (newJob){
            console.log("update website with newJob ", newJob);

            JobService
                .updateJob(newJob)
                .then(function (response){
                    vm.success = "Jobs Saved!";
                    $location.path('/dashboard/' + vm.userId + '/jobs');
                }, function (err){
                    vm.error = "error";
                });
        }

        vm.deleteJob = function (job){
            console.log("delete jobId=", vm.jobId);

            JobService
                .deleteJob(vm.jobId)
                .then(function (success){
                   console.log("JobEditController JobService deleteJob success");
                    return vm.jobId;
                }, function (err){
                    console.log("JobEditController JobService deleteJob err");
                }).then(function (jid){
                ApplicationService
                    .deleteApplication(vm.jobId)
                    .then(function (success){
                        console.log("JobEditController ApplicationService deleteApplication success");
                        $location.path('/dashboard/' + vm.userId + '/jobs');
                    }, function (err){
                        console.log("JobEditController ApplicationService deleteApplication err");
                    });

            });


        }
    };

})();


