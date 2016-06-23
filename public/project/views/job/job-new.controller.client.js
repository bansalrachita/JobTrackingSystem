(function () {
    angular
        .module("JobTracker")
        .controller("JobNewController", JobNewController);

    function JobNewController($stateParams, $location, JobService, ApplicationService, UserService) {
        var vm = this;
        vm.userId = $stateParams.uid;

        function init(){
            // TODO: should these have values?
            vm.choices = [];
            UserService
                .findUserById(vm.userId)
                .then(function (response) {
                    console.log("UserService findUserById success");
                    var user = response.data;
                    vm.user = user;
                    vm.username = user.username;
                    vm.cname = user.cname;
                    return vm.role;
                }, function (err) {
                    console.log("UserService findUserById error");
                })
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
            newJob.cname = vm.cname;
            JobService
                .addJob(newJob)
                .then(function (response){
                    // vm.success = "Jobs Saved!";
                    // $location.path('/dashboard/' + vm.userId + '/jobs');
                    var newJobId = response.data._id;
                    var application = {
                        jobId: newJobId,
                        cid: vm.userId,
                        lstApplications: [],
                        foreignUserId: []
                    };
                    return application;
                }, function (err){
                    vm.error = "Error in creating Job";
                }).then(function (application){
                console.log("Application is being created");
                ApplicationService
                    .createJobApplication(application)
                    .then(function (response){
                        vm.success = "Jobs Saved!";
                        var newApplication = response.data;
                        console.log("NewApplication Created! ", newApplication);
                        console.log("JobSaved with jid: " + application.jobId + " applicationId:" + newApplication._id)
                        $location.path('/dashboard/' + vm.userId + '/jobs');

                    }, function (err){
                        vm.error = "Error in Application creation, Job Creation Success!";
                    });

            });
        }
    };

})();


