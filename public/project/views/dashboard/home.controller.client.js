(function () {
    angular
        .module("JobTracker")
        .controller("HomeController",HomeController);

    function HomeController($rootScope, $location, $stateParams, UserService, JobService) {
        var vm = this;
        console.log("HomeController login");

        var id = $stateParams.uid;
        vm.userId = $rootScope.currentUser._id;
        console.log("HomeController login uid=" + id);
        console.log("HomeController from rootScope ", vm.userId);
        vm.savedJobsLst = [];
        function init(){

            if(id == 'guest'){
                console.log("HomeController GUEST");
                vm.role = id;
            }else {
                UserService.findUserById(id)
                    .then(function (response) {
                        console.log("UserService findUserById success");
                        var user = response.data;
                        vm.user = user;
                        vm.username = user.username;
                        vm.role = user.role;
                        return user.role;
                    }, function (err) {
                        console.log("UserService findUserById error");
                    }).then(function (role){

                    if(role == "user"){
                        var lstSavedJobs = vm.user.savedjobs;

                        for(var i in lstSavedJobs){
                            JobService
                                .findJobByJId(lstSavedJobs[i])
                                .then(function (job){
                                    console.log("foundjob ", job.data);
                                    vm.savedJobsLst.push(job.data);

                                }, function (err){
                                    console.log("err in findJobById");
                                });
                        }

                    }

                });
            }
        }
        init();

    }

})();
