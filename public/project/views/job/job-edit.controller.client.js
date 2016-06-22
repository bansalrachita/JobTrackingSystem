(function () {
    angular
        .module("JobTracker")
        .controller("JobEditController", JobEditController);

    function JobEditController($scope, $http, $stateParams, $location, JobService) {
        var vm = this;
        vm.userId = $stateParams.uid;

        vm.jobid = $stateParams.jid;

        console.log("inside JobEditController for userId=" +
            vm.userId + " and jobId=" + $scope.jobid);


        function init(){
            JobService
                .findJobByJId(vm.jobid)
                .then(function (response){
                    console.log("JobService findJobByJID ", vm.jobid);
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
    };

})();


