
(function () {
    angular
        .module("JobTracker")
        .controller("FollowingController", FollowingController);

    function FollowingController($location, $stateParams, UserService) {
        var vm = this;
        console.log("inside FollowingController login");

        var id = $stateParams.uid;

        function init() {
            // TODO: based on role
            console.log("ApplicantDbController calling UserService");
                UserService
                    .findUserById(id)
                    .then(function (response){
                        var user = response.data;
                        console.log("FollowingController UserService:findUserById success");
                        vm.user = user;
                        vm.username = user.username;
                        vm.role = user.role;
                        return user;
                    }, function (err){
                        console.log("FollowingController UserService:findUserById " +
                            " user not found! error");
                    }).then(function (user){
                        UserService
                            // .findUserByRole("user")
                            .getUsers()
                            .then(function (response){
                                console.log("FollowingController UserService:getUsers success ", response.data);
                                // vm.userList = response.data;
                                // console.log(vm.userList);
                                return response.data;
                            }, function (err){
                                console.log("FollowingController UserService:getUsers error");
                            }).then(function (userList){

                            var user;
                            var userIDInt = parseInt(vm.user._id);
                            for(var i in userList) {
                                user = userList[i];
                                if (user._id == userIDInt) {
                                    userList.splice(i, 1);
                                    break;
                                }
                            }
                            for(var i in userList){

                                user = userList[i];

                                // console.log("userchecking before " , user);
                                if(user.followers.indexOf(userIDInt) != -1) {
                                    user.followingFlag = true;
                                }else{
                                    user.followingFlag = false;
                                }
                                // console.log("userchecking, " , user);

                            }

                            vm.userList = userList;
                        });;
                });
        }

        init();

        vm.follow = function (user) {
            console.log("FollowingController currentUser" +  vm.user._id + " follow userId=", user._id);

            UserService
                .follow(vm.user._id, user._id)
                .then(function (response){
                    console.log("FollowingController UserService:Follow success");
                    user.followingFlag = true;
            }, function (err){
                    console.log("FollowingController UserService:Follow err");
            });
        }

        vm.unfollow = function (user){
            console.log("FollowingController currentUser" +  vm.user._id + " unfollow userId=", user._id);
            UserService
                .unfollow(vm.user._id, user._id)
                .then(function (response){
                    console.log("FollowingController UserService:unfollow success");
                    user.followingFlag = false;
                }, function (err){
                    console.log("FollowingController UserService:unfollow err");
                });
        }


    }


})();
