(function () {
    angular
        .module("JobTracker")
        .controller("HomeController",HomeController);

    function HomeController($location, $stateParams, UserService) {
        var vm = this;
        console.log("HomeController login");

        var id = $stateParams.uid;

        console.log("HomeController login uid=" + id);

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
                    }, function (err) {
                        console.log("UserService findUserById error");
                    });
            }
        }
        init();
    }

})();
