(function () {
    angular
        .module("JobTracker")
        .controller("SpecificJobController", SpecificJobController);


    function SpecificJobController($http, $stateParams, UserService, JobService, ApplicationService) {
        var vm = this;

        vm.userId = $stateParams.uid;
        vm.jobId = $stateParams.jid;

        console.log("SpecificJobController login for uid=" + vm.userId + " with " + vm.jobId);

        vm.choices = [{id: 'choice1'}, {id: 'choice2'}];
        function init() {
            // var user = UserService.findUserById(vm.userId);
            // vm.username = user.username;
            // vm.role = user.role;
            // vm.jobs = JobService.findJobByRole(vm.userId, vm.role);
            // vm.applied = ApplicationService.findApplied(vm.jobId, vm.userId);

            $http.get('data/us-states.json').then(function (response) {
                vm.states = response.data;
            }, function (err) {
                throw err;
            });

            UserService
                .findUserById(vm.userId)
                .then(function (response) {
                    console.log("UserService findUserById success");
                    var user = response.data;
                    vm.user = user;
                    vm.username = user.username;
                    vm.role = user.role;
                    return vm.role;
                }, function (err) {
                    console.log("UserService findUserById error");
                }).then(function (role) {
                console.log("role found by UserService " +
                    "findUserById " + role);

                JobService
                    .findJobByRole(vm.userId, role)
                    .then(function (response) {
                        console.log("JobService findJobByRole success");
                        vm.jobs = response.data;
                        // console.log(vm.jobs);
                        return vm.userId;
                    }, function (err) {
                        console.log("JobService findJobByRole error");
                    });

            }, function (err) {
                console.log("JobService findJobByRole error");
            }).then(function (id) {
                console.log("finding if applied ");
                JobService
                    .findJobByJId(vm.jobId)
                    .then(function (response) {
                        console.log("JobService findJobByJId success");
                        vm.application = response.data;
                        return vm.jobId;
                    }, function (err) {
                        console.log("JobService findJobByJId error");
                    });

            }).then(function (id) {
                ApplicationService
                    .findApplied(vm.jobId, vm.userId)
                    .then(function (response) {
                        var application = response.data;
                        console.log("ApplicationService findApplied application=", application);
                        var flag;
                        if(application.foreignUserId){
                            flag = application.foreignUserId.includes(parseInt(vm.userId));
                        }else{
                            flag = false;
                        }
                        vm.applied = flag;
                    }, function (err) {
                        console.log("ApplicationService findApplied error");
                    });
            });
        }

        init();
        console.log(vm.role);

        // vm.application = JobService.findJobByJId(vm.jobId);

        vm.apply = function () {
            vm.error="";
            console.log("SpecificJobController Apply to jid=" + vm.jobId + " uid=" + vm.userId);
            if(vm.user && vm.userApplication){
                vm.userApplication.skills = vm.user.skills;
                vm.userApplication.state = vm.userApplication.state.name;
            }else{

                vm.error = "Application cannot be submitted.";
                return;
            }

            ApplicationService
                .applyJobIdWithApplication(vm.jobId, vm.userId, vm.userApplication)
                .then(function (response) {
                    console.log("ApplicationService applyJobIdWithApplication success");
                    return vm.jobId;
                }, function (err) {
                    vm.error ="Please fill required fields";
                    console.log("ApplicationService applyJobIdWithApplication error");
                }).then(function (jobId) {
                ApplicationService
                    .findApplied(vm.jobId, vm.userId)
                    .then(function (response) {
                        var application = response.data;
                        console.log("ApplicationService findApplied application=", application);
                        var flag;
                        if(application.foreignUserId){
                            flag = application.foreignUserId.includes(parseInt(vm.userId));
                        }else{
                            flag = false;
                        }
                        vm.applied = flag;
                    }, function (err) {
                        vm.error ="Please fill required fields";
                        console.log("ApplicationService findApplied error");
                    });
            });
        };
    }

})();
