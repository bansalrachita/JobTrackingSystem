(function () {
    angular
        .module("JobTracker")
        .controller("UserprofileController", UserprofileController);

    function UserprofileController($location, $stateParams, UserService) {
        var vm = this;
        console.log("inside UserprofileController login");

        var id = $stateParams.uid;
        var userId = $stateParams.userid;
        vm.jobId = $stateParams.jid;

        vm.flag = true;
        if(vm.jobId){
            vm.flag = true;
        }else{
            vm.flag = false;
        }

        function init() {
            console.log("UserprofileController calling UserService");


            console.log("params jobId=", vm.jobId, " userId=", userId, " vmflag=", vm.flag);
            UserService
                .findUserById(userId)
                .then(function (response){
                    var user = response.data;
                    console.log("UserService:findUserById success ", user);
                    vm.user = user;
                    vm.username = user.username;
                    vm.role = user.role;
                    return user._id;
                }, function (err){
                    console.log("UserService:findUserById " +
                        " user not found! error");
                }).then(function (userId){
                UserService
                    .findUserById(userId)
                    .then(function (response){
                        console.log("UserService:findUserById success");
                        vm.userprofile = response.data;
                        console.log(vm.userprofile);
                    }, function (err){
                        console.log("UserService:findUserById error");
                    });
            });
        }
        init();
    }


})();

