(function () {
    angular
        .module("JobTracker")
        .controller("RegisterController", RegisterController);

    function RegisterController(UserService, $location) {
        var vm = this;

        console.log("RegisterController");
        vm.createUser = function (username, password, verifyPassword, email, role, regAgree) {
            console.log("RegisterController registerUser with",
                username, password, verifyPassword, email, role, regAgree);

            if (!username || !password || !verifyPassword || !email || !role || !regAgree) {
                vm.error = "Error in Registering! Fields Empty.";
                console.log("error in registering!");
            } else if (password != verifyPassword) {
                vm.error = "Passwords Same?";
                console.log("error in registering, Same Passwords!");
            } else {
                username = username.toLowerCase();

                var user = {
                    username: username,
                    password: password,
                    verifyPassword: verifyPassword,
                    email: email,
                    role: role
                };

                UserService
                    // .register(user)
                    .createUser(user)
                    .then(function (response) {
                            var newUser = response.data;
                            console.log("RegisterController response received by createUser ", newUser);
                            if (newUser._id) {
                                console.log("navigating to: " + "/user/dashboard/" + newUser._id);
                                $location.path('/dashboard/' + newUser._id + '/home');

                            } else {
                                vm.error = "Error in Registering!";
                                console.log("error in registering, no ID made!");
                            }
                        },
                        function (err) {
                            vm.error = "Error in Registering! Username exists";
                            console.log("RegisterController error in registering!");
                        });
            }
        }
        vm.cancel = function () {
            console.log("RegisterController cancel, $location url => /login");
            $location.url("/login");
        }
    }

})();