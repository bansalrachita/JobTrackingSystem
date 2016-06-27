(function () {
    angular
        .module("JobTracker")
        .controller("SpecificJobController", SpecificJobController);


    function SpecificJobController($http, $stateParams, UserService, JobService, ApplicationService, ExternalDataService) {
        var vm = this;

        vm.userId = $stateParams.uid;
        vm.jobId = $stateParams.jid;

        console.log("SpecificJobController login for uid=" + vm.userId + " with " + vm.jobId);

        function init() {

            ExternalDataService
                .getStates()
            // $http.get('data/us-states.json')
                .then(function (response) {
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
                    console.log("user ", user);
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

                        // find you match with application
                        if(vm.user.role == "user"){
                            var match = {
                                skill:[],
                                value:0,
                                percent:0,
                                locationMatch:0
                            };
                            if(vm.application && vm.application.skills && vm.application.skills != null){

                                angular.forEach(vm.application.skills, function (key, value) {
                                    for(var i in vm.user.skills){
                                        if(key && key!=null && key.toLowerCase() == vm.user.skills[i].toLowerCase()){
                                            match.skill.push(key);
                                            match.value +=1;
                                        }
                                    }
                                });

                                match.percent = parseInt((match.value/vm.application.skills.length) * 100);
                            }

                            if(vm.application.state && vm.user.state && vm.user.state!=null){
                                if(vm.application.state.toLowerCase() == vm.user.state.toLowerCase()){
                                    match.locationMatch += 1;
                                }
                            }

                            if(vm.application.city && vm.user.city && vm.application.city.toLowerCase() == vm.user.city.toLowerCase()){
                                match.locationMatch += 1;
                            }

                            match.locationMatch = parseInt(match.locationMatch/2 * 100);
                            vm.match = match;
                        }

                        //end of find match

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

                        if(vm.user.role == "user") {


                            var flag, flag2;
                            console.log("application.foreignUserId ", application.foreignUserId, "vm.userId ", vm.userId);
                            console.log("application ", application);

                            if (application.foreignUserId) {
                                // flag = application.foreignUserId.includes(parseInt(vm.userId));
                                console.log("application.foreignUserId ", application.foreignUserId, "vm.userId ", vm.userId);
                                flag = application.foreignUserId.includes(vm.userId);
                            } else {
                                flag = false;
                            }
                            vm.applied = flag;

                            if(vm.user.savedjobs && vm.user.savedjobs.includes(vm.jobId)){
                                console.log("user.savedJobs ", vm.user.savedjobs, "vm.jobId ", vm.jobId);
                                vm.savedJob = true;
                            }else{
                                vm.savedJob = false;
                            }

                        }
                    }, function (err) {
                        console.log("ApplicationService findApplied error");
                    });
            });
        }

        init();

        vm.saveJob = function (){
            console.log("ApplicationService save job");

            UserService
                .saveJob(vm.userId, vm.jobId)
                .then(function (success){
                    console.log("ApplicationService save job success ", vm.userId ,
                        " for ", vm.jobId);
                    vm.savedJob = true;
                }, function (err){
                    console.log("ApplicationService save job err ", vm.userId ,
                        " for ", vm.jobId);
                    vm.savedJob = false;
                });
        }

        vm.unsaveJob = function (){
            console.log("ApplicationService save job");

            UserService
                .unsaveJob(vm.userId, vm.jobId)
                .then(function (success){
                    console.log("ApplicationService unsave job success ", vm.userId ,
                        " for ", vm.jobId);
                    vm.savedJob = false;
                }, function (err){
                    console.log("ApplicationService unsave job err ", vm.userId ,
                        " for ", vm.jobId);
                    vm.savedJob = true;
                });
        }
                
    }
})();
