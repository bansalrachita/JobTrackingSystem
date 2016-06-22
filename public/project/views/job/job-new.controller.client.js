(function () {
    angular
        .module("JobTracker")
        .controller("JobNewController", JobNewController);

    function JobNewController($scope, $http, $stateParams, $location, JobService) {
        var vm = this;
        vm.userId = $stateParams.uid;

        function init(){
            vm.choices = [];
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

        vm.createJob = function (newJob){
            console.log("update website with newJob ", newJob);
            newJob.cid = vm.userId;

            JobService
                .addJob(newJob)
                .then(function (response){
                    vm.success = "Jobs Saved!";
                    $location.path('/dashboard/' + vm.userId + '/jobs');
                }, function (err){
                    vm.error = "error";
                });
        }
    };

})();


