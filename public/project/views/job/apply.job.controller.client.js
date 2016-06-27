(function () {
    angular
        .module("JobTracker")
        .controller("ApplyJobController", ApplyJobController);


    function ApplyJobController($http, $rootScope, $location, $stateParams, ApplicationService, ExternalDataService) {
        var vm = this;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.jobId = $stateParams.jid;
            console.log("user ", vm.user);
            console.log("jobId ", vm.jobId);
            vm.choices = [{name: null}];
            vm.applied = false;

            ExternalDataService
                .getStates()
                // .then
                // $http.get('data/us-states.json')
                .then(function (response) {
                    vm.states = response.data;
                }, function (err) {
                    throw err;
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


        vm.apply = function () {
            vm.error = "";
            console.log("SpecificJobController Apply to jid=" + vm.jobId + " uid=" + vm.userId);
            if (vm.user && vm.userApplication) {
                vm.userApplication.skills = vm.user.skills;
                vm.userApplication.state = vm.userApplication.state.name;
            } else {
                vm.error = "Application cannot be submitted.";
                return;
            }
            console.log("user ", vm.user);
            vm.userApplication.userId = vm.user._id;
            vm.userApplication.username = vm.user.username;
            vm.userApplication.name = vm.user.firstName + " " + vm.user.lastName;
            vm.userApplication.degree = vm.userApplication.degree.toLowerCase();
            vm.userApplication.skills = [];
            angular.forEach(vm.choices, function (key, value) {
                if(key.name && key.name != null && key.name.length > 1){
                    vm.userApplication.skills.push(key.name);
                }
            });

            ApplicationService
                .applyJobIdWithApplication(vm.jobId, vm.user._id, vm.userApplication)
                .then(function (response) {
                    console.log("ApplicationService applyJobIdWithApplication success");
                    $location.path("/dashboard/" + vm.user._id + "/jobs/" + vm.jobId);
                }, function (err) {
                    vm.error = "Error in applying";
                    console.log("ApplicationService applyJobIdWithApplication error");
                });
        };
    }
})();
