(function () {
    angular
        .module("JobTracker")
        .controller("DashboardController", DashboardController);

    function DashboardController($rootScope, $location, $stateParams, UserService) {

        var vm = this;
        // var id = $stateParams.uid;


        // TODO : check for others except linkedin
        var id = $rootScope.currentUser._id;
        vm.userId = $rootScope.currentUser._id;
        console.log("DashboardController login uid=" + id);
        console.log("DashboardController from rootScope ", vm.userId);

        function init(){
            if(id == "guest"){
                console.log("GUEST");
                vm.role = "guest";
                vm.user = {};
                vm.user.username = "Guest";
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

        vm.logout = function (){
            console.log("LoginController logout");

            UserService
                .logout()
                .then(function (response){
                    console.log("LoginController received response from logout");
                    $rootScope.currentUser = null;
                    $location.url("/");
                });
        };

        vm.toggleMenu = function(){
            $('#bs-sidebar-navbar-collapse-1').on('click', function(){
                $('.navbar-toggle').click()
            });
        }

    }


})();