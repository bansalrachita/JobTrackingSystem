(function () {
    angular
        .module("JobTracker")
        .controller("JobNewController", JobNewController);

    function JobNewController($stateParams, $http, $location, JobService, ApplicationService, UserService, ExternalDataService) {
        var vm = this;
        vm.userId = $stateParams.uid;

        function init(){
            vm.choices = [{name:null}];
            vm.selectedState = "";
            
            UserService
                .findUserById(vm.userId)
                .then(function (response) {
                    console.log("UserService findUserById success ", response.data);
                    var user = response.data;
                    vm.user = user;
                    vm.username = user.username;
                    vm.cname = user.cname;
                    return vm.role;
                }, function (err) {
                    console.log("UserService findUserById error");
                });
            
            ExternalDataService
                .getStates()
            // $http.get('data/us-states.json')
                .then(function (response) {
                vm.states = response.data;
            });
        }
        init();

        vm.addNewChoice = function () {
            vm.choices.push({name:null});
        };

        vm.removeChoice = function () {
            var lastItem = vm.choices.length - 1;
            vm.choices.splice(lastItem);
        };

        vm.createJob = function (newJob){
            console.log("update website with newJob ", newJob);
            newJob.cid = vm.userId;
            newJob.cname = vm.cname;
            newJob.skills = [];
            newJob.state = vm.selectedState.name;
            angular.forEach(vm.choices, function (key,value) {
                newJob.skills.push(key.name);
            });

            JobService
                .addJob(newJob)
                .then(function (response){
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
                console.log("Application is being created", application);
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


