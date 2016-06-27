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
                .then(function (response) {
                    var user = response.data;
                    console.log("FollowingController UserService:findUserById success");
                    vm.user = user;
                    vm.username = user.username;
                    vm.role = user.role;
                    return user;
                }, function (err) {
                    console.log("FollowingController UserService:findUserById " +
                        " user not found! error");
                }).then(function (user) {
                UserService
                // .findUserByRole("user")
                    .getUsers()
                    .then(function (response) {
                        console.log("FollowingController UserService:getUsers success ", response.data);
                        // vm.userList = response.data;
                        return response.data;
                    }, function (err) {
                        console.log("FollowingController UserService:getUsers error");
                    }).then(function (userList) {

                    var user;
                    // var userIDInt = parseInt(vm.user._id);
                    var userIDInt = vm.user._id;
                    vm.currentUserFromList;
                    for (var i in userList) {
                        user = userList[i];
                        if (user._id == userIDInt) {
                            vm.currentUserFromList = user;
                            userList.splice(i, 1);
                            break;
                        }
                    }
                    // if user
                    console.log("followers", vm.currentUserFromList.followers);
                    console.log("following", vm.currentUserFromList.following);
                    if (vm.currentUserFromList.followers) {
                        console.log("following", vm.currentUserFromList.following.length);
                        vm.currentUserFromList.followersNumber = vm.currentUserFromList.followers.length;
                    }
                    if (vm.currentUserFromList.following) {
                        vm.currentUserFromList.followingNumber = vm.currentUserFromList.following.length;
                    }

                    for (var j in userList) {

                        user = userList[j];

                        // console.log("userchecking before " , user);
                        if (user.followers.indexOf(userIDInt) != -1) {
                            user.followingFlag = true;
                        } else {
                            user.followingFlag = false;
                        }
                        // console.log("userchecking, " , user);
                        if (user.following) {
                            user.followingNumber = user.following.length;
                        }

                        if (user.followers) {
                            user.followersNumber = user.followers.length;
                        }

                        if (vm.currentUserFromList.followers.indexOf(user._id) != -1) {

                            user.followerFlag = true;
                        } else {
                            user.followerFlag = false;
                        }

                    }

                    vm.userList = userList;

                });
            });
        }

        init();


        vm.filterVar = '';
        vm.changeFilterTo = function (pr) {
            console.log("FollowingController Change filter to", pr);
            vm.filterVar = pr;
        };

        vm.getFilter = function () {
            console.log("FollowingController case getfilter active=", vm.filterVar);
            switch (vm.filterVar) {
                case 'user':
                    return {role: 'user'};
                case 'company':
                    return {role: 'company'};
                case 'following':
                    return {followingFlag: true};
                case 'notfollowing':
                    return {followingFlag: false};
                case 'follower':
                    return {followerFlag: true};
                default:
                    return {};
            }
        };

        vm.follow = function (user) {
            console.log("FollowingController currentUser" +  vm.user._id + " follow userId=", user._id);

            UserService
                .follow(vm.user._id, user._id)
                .then(function (response){
                    console.log("FollowingController UserService:Follow success");
                    user.followingFlag = true;
                    user.followersNumber = user.followersNumber + 1;
                    // vm.user.followersNumber = user.followersNumber + 1;
                    vm.currentUserFromList.followingNumber = vm.currentUserFromList.followingNumber + 1;

                }, function (err){

                    console.log("FollowingController UserService:Follow err");
                });
        };

        vm.unfollow = function (user){
            console.log("FollowingController currentUser" +  vm.user._id + " unfollow userId=", user._id);
            UserService
                .unfollow(vm.user._id, user._id)
                .then(function (response){
                    console.log("FollowingController UserService:unfollow success");
                    user.followingFlag = false;
                    user.followersNumber = user.followersNumber - 1;
                    // vm.user.followersNumber = vm.user.followersNumber - 1;
                    vm.currentUserFromList.followingNumber = vm.currentUserFromList.followingNumber - 1;
                }, function (err){
                    console.log("FollowingController UserService:unfollow err");
                });
        };

    }


})();
