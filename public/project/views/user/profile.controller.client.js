(function () {
    angular
        .module("JobTracker")
        .controller("ProfileController", ProfileController);

    function ProfileController($window, $document, $location, $stateParams, UserService, $http, ExternalDataService) {
        var vm = this;
        vm.updateUser = updateUser;
        // vm.unregisterUser = unregisterUser;
        var id = $stateParams.uid;

        console.log("ProfileController:Client login id=", id);
        vm.disable = true;

        console.log("inside ProfileController login id=", id);
        vm.workItem = [];
        vm.selectedState = '';
        vm.selectedState1 = '';
        vm.choices = [];
        vm.disable = false;
        vm.selectedField = '';

        vm.fields = [{name: "UI/UX"},
            {name: "Java Programming"},
            {name: "Back-end Developer"},
            {name: "JavaScript Developer"},
            {name: "Big Data Engineer"},
            {name: "Software Engineer"}];

        vm.disabled = function () {
            vm.disable = true;
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
                            vm.workItem = user.workEx;
                            vm.selectedState = user.state;
                            if(user.education && user.education.length > 0){
                                vm.selectedState1 = user.education[0].state;
                            }
                            for (var i in vm.user.skills) {
                                vm.choices.push({name: vm.user.skills[i]});
                            }
                            
                            vm.selectedField = user.spl;

                            angular.forEach(vm.fields, function (key, value) {
                               if(key.name == vm.selectedField){
                                   vm.selectedField = vm.fields[value];
                               }
                            });

                            ExternalDataService
                                .getStates()
                            // $http.get('data/us-states.json')
                                .then(function (response) {
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

                            });
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

            if(vm.user.role == "user"){
                if(vm.user.education  && vm.user.education.length > 0){
                    vm.user.education[0].state = vm.selectedState1.name;
                }
                vm.user.state = vm.selectedState.name;
                vm.user.spl = vm.selectedField.name;
                vm.user.skills = [];
                angular.forEach(vm.choices, function (key, value) {
                    vm.user.skills.push(key.name);
                });
            }

            console.log("selectedField newUser", newUser);

            UserService
                .updateUser(id, newUser)
                .then(function (response) {
                        vm.profileSaved = "Success!";
                        $window.scrollTo(0, 0);

                    },
                    function (response) {
                        vm.error = "Error!";
                    });
            vm.disable = true;
        }

        vm.deleteUser = function(){
            console.log("ProfileController:Client unregister User userId=" + id);

            var vartoremoveFollowings = vm.user.following;
            var vartoremoveFollowers = vm.user.followers;
            console.log("ProfileController:Client unregister User toremoveFollowers ", vartoremoveFollowings);
            if(vartoremoveFollowings){
                for(var i in vartoremoveFollowings){
                    UserService
                        .unfollow(vm.userId, vartoremoveFollowings[i])
                        .then(function (success){
                            console.log("ProfileController:Client unregister:", vm.userId , " unfollow ", vartoremoveFollowings[i]);
                        }, function (err){
                            console.log("ProfileController:Client unregister : unfollow before delete error");
                        });
                }
            }

            if(vartoremoveFollowers){
                for(var i in vartoremoveFollowers){
                    UserService
                        .unfollow(vartoremoveFollowers[i], vm.userId)
                        .then(function (success){
                            console.log("ProfileController:Client unregister:", vartoremoveFollowers[i], " unfollow ", vm.userId);
                        }, function (err){
                            console.log("ProfileController:Client unregister : unfollow before delete error");
                        });
                }
            }


            UserService
                .deleteUser(id)
                .then(function (response) {
                    console.log("user deleted!");
                    $location.url("/");
                }, function (response) {
                    console.log("unable to delete user!");
                    vm.error = "unable to delete user!";
                });

        };

        vm.addNewChoice = function () {
            vm.choices.push({name: null});
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