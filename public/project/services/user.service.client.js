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
            findUserByRole: findUserByRole
        };
        return api;

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

        // // TODO: Pass a user here too
        // function registerUser(username, password, verifyPassword) {
        //     console.log("in UserService, register User with id" + id);
        //     var user = {
        //         username: username,
        //         password: password
        //     }
        //     var url = "/api/register/";
        //     return $http.put(url, user);
        // }

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

            console.log("in UserService, createUser");
            return $http.post("/api/user", user);


        }
    }
})();