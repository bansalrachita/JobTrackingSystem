
(function () {
    angular
        .module("JobTracker")
        .factory("ExternalDataService", ['$http', ExternalDataService]);

    function ExternalDataService($http) {
        var api =  {
            getStates: getStates,
            getUSData: getUSData
        };
        return api;
        
        function getStates() {
            var url = "data/us-states.json";
            return $http.get(url);
        }

        function getUSData(value){
            var url = 'data/usdata.json';
            return $http.get(url);
        }

    }

})();
