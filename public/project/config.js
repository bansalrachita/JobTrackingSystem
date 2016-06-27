(function () {
    angular
        .module("JobTracker")
        .config(['$stateProvider', '$urlRouterProvider', Config]);

    function Config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('index', {
                abstract: true,
                url: '',
                template: "<div ui-view=''></div>"
                // templateUrl: 'index.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/user/login.view.client.html',
                parent: 'index',
                controller: 'LoginController',
                controllerAs: "model"
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/user/register.view.client.html',
                parent: 'index',
                controller: 'RegisterController',
                controllerAs: "model"
            })
            .state('dashboard', {
                url: '/dashboard/:uid',
                templateUrl: 'views/dashboard/dashboard.view.client.html',
                parent: 'index',
                controller: 'DashboardController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin }
            })
            .state('home', {
                url: '/home',
                templateUrl: 'views/dashboard/home.view.client.html',
                parent: 'dashboard',
                controller: 'HomeController',
                controllerAs: 'model',
                resolve: { loggedin: checkLoggedin }
            })
            .state('follow', {
                url : '/follow',
                templateUrl: 'views/dashboard/follow.view.client.html',
                parent: 'dashboard',
                controller: 'FollowingController',
                controllerAs: 'model'
            })
            .state('database',{
                url: '/db',
                templateUrl: 'views/dashboard/db.view.client.html',
                parent: 'dashboard',
                controller: 'ApplicantDbController',
                controllerAs: 'model'
            })
            .state('dbuser',{
                url: '/dbuser/:userid',
                templateUrl: 'views/dashboard/userprofile.view.client.html',
                parent: 'dashboard',
                controller: 'UserprofileController',
                controllerAs: 'model'
            })
            .state('userprofile',{
                url: '/jobs/:jid/userprofile/:userid',
                templateUrl: 'views/dashboard/userprofile.view.client.html',
                parent: 'dashboard',
                controller: 'UserprofileController',
                controllerAs: 'model'
            })
            .state('jobsquery', {
                url: '/jobs?company',
                templateUrl: 'views/job/job.view.client.html',
                parent: 'dashboard',
                controller: 'JobController',
                controllerAs: 'model'
            })
            .state('jobs', {
                url: '/jobs',
                templateUrl: 'views/job/job.view.client.html',
                parent: 'dashboard',
                controller: 'JobController',
                controllerAs: 'model'
            })
            .state('jobsSpecific', {
                url: '/jobs/:jid',
                templateUrl: 'views/job/specific.job.view.client.html',
                parent: 'dashboard',
                controller: 'SpecificJobController',
                controllerAs: 'model'
            })
            .state('editJob', {
                url: '/jobs/edit/:jid',
                templateUrl: 'views/job/job-edit.view.client.html',
                parent: 'dashboard',
                controller: 'JobEditController',
                controllerAs: 'model'
            })
            .state('newJob', {
                url: '/newjob',
                templateUrl: 'views/job/job-new.view.client.html',
                parent: 'dashboard',
                controller: 'JobNewController',
                controllerAs: 'model'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'views/user/profile.view.client.html',
                parent: 'dashboard',
                controller: 'ProfileController',
                controllerAs: 'model'
            })
            .state('search', {
                url: '/search',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/search.view.client.html',
                controller: 'SearchController',
                controllerAs: 'model'
            })
            .state('tree', {
                url: '/jobs/:jid/tree',
                templateUrl: 'views/job/tree.view.client.html',
                parent: 'dashboard',
                controller: 'TreeController',
                controllerAs: 'model'
            })
            .state('apply', {
                url: '/jobs/:jid/apply',
                templateUrl: 'views/job/application.view.client.html',
                parent: 'dashboard',
                controller: 'ApplyJobController',
                controllerAs: 'model'
            })
        ;

        $urlRouterProvider.when('/dashboard', '/dashboard/home');
        // $urlRouterProvider.when('/dashboard', '/home');
        $urlRouterProvider.otherwise('/login');

        function checkLoggedin($q, $location, $rootScope, UserService) {
            console.log("check loggedin config.js");
            var indexOfGuest = $location.path().indexOf('guest');
            console.log("guest? ", indexOfGuest);
            var deferred = $q.defer();
            UserService
                .checkLoggedin()
                .then
                (function(response) {
                    console.log("check loggedin config.js success");
                    var user = response.data;
                    console.log("user logged in as uid=", user);
                    $rootScope.errorMessage = null;
                    if (user !== '0') {
                        $rootScope.currentUser = user;
                        deferred.resolve();
                    }
                    else if (indexOfGuest != -1) {
                        // redirect as guest login
                        $rootScope.currentUser = { _id : 'guest', role : 'guest'};
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                        console.log("user not logged in, reroute to login");
                        $location.url('/login');
                        console.log($location.path());
                    }
                });
            return deferred.promise;
        }

    }
})();