
(function () {
    angular
        .module("JobTracker")
        .controller("SearchController",SearchController);

    function SearchController($location) {
        var vm = this;
        console.log("inside SearchController login");
    }

})();
