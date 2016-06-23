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
                controllerAs: 'model'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'views/dashboard/home.view.client.html',
                parent: 'dashboard',
                controller: 'HomeController',
                controllerAs: 'model'
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
            .state('userprofile',{
                url: '/userprofile/:userid',
                templateUrl: 'views/dashboard/userprofile.view.client.html',
                parent: 'dashboard',
                controller: 'UserprofileController',
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
                controller: 'treeController',
                controllerAs: 'model'
            })
            .state('apply', {
                url: '/jobs/:jid/apply',
                templateUrl: 'views/job/application.view.client.html',
                parent: 'dashboard',
                controller: 'SpecificJobController',
                controllerAs: 'model'
            })
        ;

        $urlRouterProvider.when('/dashboard', '/dashboard/overview');
        $urlRouterProvider.otherwise('/login');
    }
})();