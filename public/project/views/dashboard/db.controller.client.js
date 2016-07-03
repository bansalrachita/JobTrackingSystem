
(function () {
    angular
        .module("JobTracker")
        .controller("ApplicantDbController", ApplicantDbController);

    function ApplicantDbController($location, $stateParams, UserService) {
        var vm = this;
        console.log("inside ApplicantDbController");

        var id = $stateParams.uid;
        console.log("$stateParams.applicant", $stateParams.applicant);

        if($stateParams.applicant){
            vm.searchText = $stateParams.applicant;
        }

        console.log("ApplicantDbController applicant", vm.searchText);

        function init() {
            // TODO: based on role
            console.log("ApplicantDbController calling UserService");
                UserService
                    .findUserById(id)
                    .then(function (response){
                        var user = response.data;
                        console.log("UserService:findUserById success");
                        vm.user = user;
                        vm.username = user.username;
                        vm.role = user.role;
                        return user;
                    }, function (err){
                        console.log("UserService:findUserById " +
                            " user not found! error");
                    }).then(function (user){
                        UserService
                            .findUserByRole("user")
                            .then(function (response){
                                console.log("UserService:getUsers success");
                                vm.userList = response.data;
                                console.log(vm.userList);
                            }, function (err){
                                console.log("UserService:getUsers error");
                            });
                });
        }

        init();

        vm.getProfile = function (userId) {
            console.log("ApplicantDbController getProfile of userId=", userId);
            console.log('/dbuser/' + userId);
            $location.path('/dashboard/' + vm.user._id + '/dbuser/' + userId);
        }

    }


})();
