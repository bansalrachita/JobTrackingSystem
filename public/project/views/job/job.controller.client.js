(function () {
    angular
        .module("JobTracker")
        .controller("JobController", JobController);

    function JobController($location, $stateParams, UserService, JobService) {
        var vm = this;

        var id = $stateParams.uid;
        var jobId = $stateParams.jid;
        var companyStr = "";
        var pagesize = 20;
        
        if ($stateParams.company) {
            companyStr = $stateParams.company;
        }

        console.log("companyStr", companyStr);
        vm.id = id;
        console.log("inside JobController login for uid=" + id + " with " + jobId);

        function init() {

            vm.pageNum = 1;

            // TODO: based on role
            if (vm.id == 'guest') {
                vm.role = 'guest';
                JobService
                // .findJobByRole(id, "user")
                    .findJobByPageNumber(id, "user", 1)
                    .then(function (response) {
                        console.log("JobService findJobByRole success");
                        vm.jobs = response.data;
                        console.log("found jobs#");
                    }, function (err) {
                        console.log("JobService findJobByRole error");
                    });
            } else {

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
                        // .findJobByRole(id, role)
                            .findJobByPageNumber(id, role, vm.pageNum)
                            .then(function (response) {
                                console.log("JobService findJobByRole success");
                                vm.jobs = response.data;
                                console.log("found jobs");
                                //company search for user
                                if (companyStr != "") {
                                    companyStr = companyStr.toLowerCase();
                                    var jobs = [];
                                    console.log("companyStr", companyStr);
                                    for (var job in vm.jobs) {
                                        console.log("job", vm.jobs[job]);
                                        if (vm.jobs[job].cname.toLowerCase().indexOf(companyStr) !== -1) {
                                            jobs.push(angular.copy(vm.jobs[job]));
                                        }
                                    }
                                    vm.jobs = angular.copy(jobs);
                                    console.log("vm.jobs", vm.jobs);
                                }
                            }, function (err) {
                                console.log("JobService findJobByRole error");
                            });

                    }, function (err) {
                        console.log("JobService findJobByRole error");
                    });
            }

        }

        init();

        // pagination
        vm.findJobByPageNumber = function (page, flag) {
            vm.disable = false;
            // console.log("vm.size", vm.jobs.length);
            if (flag && flag == "next" &&  vm.jobs.length > 1) {
                vm.pageNum = Math.ceil(page + 1);
                // console.log("next", vm.pageNum);
            } else if (flag && flag == "previous" && vm.pageNum > 1) {
                vm.pageNum = Math.ceil(page - 1);
                // console.log("prevoius", vm.pageNum);
            }else if(flag == "previous" && vm.pageNum < 1){
                vm.disable = true;
            }else if(flag == "next" && vm.jobs && vm.jobs.length < pagesize){
                vm.disable = true;
            }


            JobService
                .findJobByPageNumber(id, vm.role, vm.pageNum)
                .then(function (response) {
                    console.log("JobService findJobByRole success");
                    vm.jobs = response.data;
                    console.log("found jobs");
                    //company search for user
                    if (companyStr != "") {
                        companyStr = companyStr.toLowerCase();
                        var jobs = [];
                        console.log("companyStr", companyStr);
                        for (var job in vm.jobs) {
                            console.log("job", vm.jobs[job]);
                            if (vm.jobs[job].cname.toLowerCase().indexOf(companyStr) !== -1) {
                                jobs.push(angular.copy(vm.jobs[job]));
                            }
                        }
                        vm.jobs = angular.copy(jobs);
                        console.log("vm.jobs", vm.jobs);
                    }
                }, function (err) {
                    console.log("JobService findJobByRole error");
                });
        };

        vm.showRegister = function () {
            console.log("JobController show register");
            vm.register = "Please register to continue!";
        }
    }

})();
