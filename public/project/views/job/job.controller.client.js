(function () {
    angular
        .module("JobTracker")
        .controller("JobController", JobController);

    function JobController($location, $stateParams, UserService, JobService) {
        var vm = this;

        var id = $stateParams.uid;
        var jobId = $stateParams.jid;
        vm.id = id;
        console.log("inside JobController login for uid=" + id + " with " + jobId);

        function init(){
            // TODO: based on role
            if(vm.id == 'guest'){
                vm.role = 'guest';
                JobService
                    .findJobByRole(id, "user")
                    .then(function (response) {
                        console.log("JobService findJobByRole success");
                        vm.jobs = response.data;
                        console.log("found jobs# =");
                        // console.log(vm.jobs);
                    }, function (err) {
                        console.log("JobService findJobByRole error");
                    });
            }else {


                UserService
                    .findUserById(id)
                    .then(function (response) {
                        console.log("UserService findUserById success");
                        var user = response.data;
                        vm.username = user.username;
                        vm.role = user.role;
                        return vm.role;
                    }, function (err) {
                        console.log("UserService findUserById error");
                    })
                    .then(function (role) {
                        console.log("role found by UserService " +
                            "findUserById " + role);

                        JobService
                            .findJobByRole(id, role)
                            .then(function (response) {
                                console.log("JobService findJobByRole success");
                                vm.jobs = response.data;
                                console.log("found jobs# =");
                                // console.log(vm.jobs);
                            }, function (err) {
                                console.log("JobService findJobByRole error");
                            });

                    }, function (err) {
                        console.log("JobService findJobByRole error");
                    });
            }

        }
        init();

    }

})();
