(function () {
    angular
        .module("JobTracker")
        .factory("TreeService", TreeService);

    function TreeService($http) {
        var api = {
            drawTree: drawTree,
            getApplicants:getApplicants
        };

        return api;

        function drawTree(jid) {
            var url = "/api/application/tree/" + jid;
            return $http.get(url);
        }

        function getApplicants(jid) {
            var url = "/api/application/applicants/" + jid;
            return $http.get(url);
        }
    }
})();
