
(function () {
    angular
        .module("JobTracker")
        .controller("ProfileController", ProfileController);

    function ProfileController($location, $stateParams, UserService, $http) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.unregisterUser = unregisterUser;
        var id = $stateParams.uid;

        console.log("ProfileController:Client login id=", id);
        vm.disable = true;

        console.log("inside ProfileController login id=", id);
        vm.workItem = [];
        vm.selectedState = '';
        vm.selectedState1 = '';


        vm.disabled = function () {
            vm.disable = false;
        };

        function init() {

            UserService
                .findUserById(id)
                .then(function (response) {
                    var user = response.data;
                    if (user._id) {
                        vm.userId = user._id;
                        vm.user = user;
                        vm.username = user.username;
                        vm.role = user.role;
                        console.log("role " + vm.role);
                        console.log("role " + vm.role + " " + vm.userId);
                        console.log(user);
                        if (user.role == "user") {
                            vm.choices = user.skills;
                            vm.workItem = user.workEx;
                            vm.selectedState = user.state;
                            vm.selectedState1 = user.education[0].state;
                        }
                    }
                    else {
                        vm.error = "User not found!";
                    }

                }, function (err) {
                    console.log("err");
                });

        }

        init();

        function updateUser(newUser) {
            console.log("ProfileController:Client Updating new user= ", newUser);

            vm.user = newUser;
            UserService
                .updateUser(id, newUser)
                .then(function (response) {
                        vm.profileSaved = "Success!";
                    },
                    function (response) {
                        vm.error = "Error!";
                    });
            vm.disable = true;
        }

        function unregisterUser(newUser) {

            console.log("ProfileController:Client unregister User userId=" + id);

            UserService
                .deleteUser(id)
                .then(function (response) {
                    console.log("user deleted!");
                    $location.url("/");
                }, function (response) {
                    console.log("unable to delete user!");
                    vm.error = "unable to delete user!";
                });
        }

        $http.get('data/us-states.json').then(function (response) {
            vm.states = response.data;
            console.log(vm.states);
            angular.forEach(vm.states, function (key, value) {
                if (key.name == vm.selectedState) {
                    console.log(key);
                    vm.selectedState = vm.states[value];
                }
                if (key.name == vm.selectedState1) {
                    console.log(key);
                    vm.selectedState1 = vm.states[value];
                }
            });

        }, function (err) {
            throw err;
        });

        vm.addNewChoice = function () {
            var newItemNo = vm.choices.length + 1;
            vm.choices.push('');
        };

        vm.removeChoice = function () {
            var lastItem = vm.choices.length - 1;
            vm.choices.splice(lastItem);
        };

        vm.addWorkExperience = function () {
            var newWorkItem = vm.workItem.length + 1;
            vm.workItem.push({
                id: newWorkItem,
                company: '',
                duration: '',
                position: '',
                desc: ''
            });
        };
    }

})();