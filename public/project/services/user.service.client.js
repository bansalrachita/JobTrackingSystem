(function () {
    angular
        .module("JobTracker")
        .factory("UserService", UserService);

    function UserService($http) {
        var api = {
            createUser: createUser,
            findUserById: findUserById,
            updateUser: updateUser,
            findUserByUsername: findUserByUsername,
            findUserRoleById: findUserRoleById,
            getUsers: getUsers,
            findUserByCredentials: findUserByCredentials,
            findUserByRole: findUserByRole,
            saveJob: saveJob,
            unsaveJob: unsaveJob,
            follow: follow,
            unfollow: unfollow,
            login: login,
            logout: logout,
            register: register,
            checkLoggedin: checkLoggedin
        };
        return api;

        function saveJob(userId, jobId){
            console.log("UserService:Client ", userId, " saveJob ", jobId);
            return $http.put("/api/user/" + userId +"/savejob/" + jobId);
        }

        function unsaveJob(userId, jobId){
            console.log("UserService:Client ", userId, " unsaveJob ", jobId);
            return $http.delete("/api/user/" + userId +"/unsavejob/" + jobId);
        }

        function checkLoggedin() {
            console.log("UserService:Client check loggedin");
            return $http.get("/api/loggedin");
        }

        function logout(user){
            console.log("UserService:Client logout(user)");
            return $http.post("/api/logout");
        }
        function login(username, password){
            console.log("UserService:Client login(user) ", username, password);
            return $http.post("/api/login", {username: username, password: password});
        }

        function register(user){
            return $http.post("/api/register", user);
        }

        function follow(currentUserId, userId){
            console.log("UserService:Client currentUser=" + currentUserId + " follow userId=", userId);
            var url = "/api/user/"+ currentUserId +"/follows/" + userId;
            return $http.put(url);
        }

        function unfollow(currentUserId, userId){
            console.log("UserService:Client currentUser=" + currentUserId + " unfollow userId=", userId);
            var url = "/api/user/"+ currentUserId +"/unfollows/" + userId;
            return $http.delete(url);
        }

        function findUserByRole(role) {
            console.log("UserService:Client findUserByRole role=", role);
            var url = "/api/user?role=" + role;
            return $http.get(url);
        }

        function getUsers() {
            console.log("UserService:Client getUsers");
            var url = "/api/user/";
            return $http.get(url);
        }

        function findUserById(userId) {
            console.log("UserService:Client finding user by id=", userId);
            var url = "/api/user/" + userId;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            console.log("UserService:Client finding user by username=", username);
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        function findUserRoleById(userId) {
            console.log("UserService:Client finding user by username=", userId);
            var url = "/api/user/role/" + userId;
            return $http.get(url);
        }

        function updateUser(userId, user) {
            console.log("UserService:Client update userId=" + userId);
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        function findUserByCredentials(username, password) {
            console.log("UserService:Client finding user by findUserByCredentials (", username,
                password, ")");
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        function createUser(newUser) {
            console.log("UserService:Client createUser, newUser received " + newUser.username);

            var user = {
                username: newUser.username,
                password: newUser.password,
                email: newUser.email,
                role: newUser.role
            };

            console.log("UserService:Client createUser calling http post");
            return $http.post("/api/user", user);


        }
    }
})();