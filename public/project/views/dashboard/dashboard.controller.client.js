(function () {
    angular
        .module("JobTracker")
        .controller("DashboardController", DashboardController);

    function DashboardController($location, $stateParams, UserService) {
        var vm = this;
        var id = $stateParams.uid;

        console.log("inside DashboardController login uid=", id);

        function init(){
            if(id == "guest"){
                console.log("GUEST");
                vm.role = "guest";
            }else {
                UserService
                    .findUserById(id)
                    .then(function (response) {
                        var user = response.data;
                        console.log("UserService:findUserById success", user);
                        if (user._id) {
                            vm.userId = user._id;
                            vm.user = user;
                            vm.username = user.username;
                            vm.role = user.role;
                            console.log("DashboardController role " + vm.role + " " + vm.userId);
                        } else {
                            console.log("UserService:findUserById success" +
                                " user not found! error");
                            vm.error = "User not found";
                        }

                    }, function (err) {
                        console.log("UserService:findUserById  err");
                    });
            }
        }
        init();

    }

})();