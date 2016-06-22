
(function () {
    angular
        .module("JobTracker")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService) {
        var vm = this;

        vm.login = function (username, password) {
            console.log("inside LoginController login username=" + username);

            UserService
                .findUserByCredentials(username, password)
                .then(function (response) {
                    var user = response.data;
                    if (user._id) {
                        console.log('userfound ', user);
                        vm.userId = user._id;
                        vm.user = user;
                        vm.username = user.username;
                        vm.role = user.role;
                        console.log("role " + vm.role + " " + vm.userId);

                        if (user.role === "company") {
                            console.log('route to ' + '/dashboard/' + user._id + '/home');
                            $location.path('/dashboard/' + user._id + '/home');
                        } else if (user.role === "user") {
                            console.log('route to ' + '/dashboard/' + user._id + '/home');
                            $location.path('/dashboard/' + user._id + '/home');
                        } else {
                            console.log("user type invalid");
                        }
                    } else {
                        vm.error = "User not found";
                    }


                }, function (err) {
                    vm.error = "User not found";
                    console.log("err");
                });
        }

        vm.register = function (username) {
            console.log("inside register function, calling $location.url");
            // TODO : should use angular's routing or href?
            $location.url("/register");
        }
    }

})();