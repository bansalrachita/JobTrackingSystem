(function () {
    angular
        .module("JobTracker")
        .controller("mapController", mapController);

    function mapController($scope, $http, $stateParams) {
        var vm = this;
        vm.userId = $stateParams.uid;
       $scope.jobid = $stateParams.jid;

        console.log("inside mapController for userId=" +
            vm.userId + " and jobId=" + $scope.jobid);

        $http.get('data/usdata.json').then(function (response) {
            console.log("inside mapController");
            $scope.land = topojson.feature(response.data, response.data.objects.states).features;
            $scope.boundary = topojson.mesh(response.data, response.data.objects.states, function (a, b) {
                return a !== b;
            });
        }, function (err) {
            throw err;
        });

        $http.get('data/us-states.json').then(function (response) {
            $scope.idnamemap = {
                // 0: null
            };

            $scope.shortnameidmap = {
                // 0: null
            };
            angular.forEach(response.data, function (value, key) {
                $scope.idnamemap[value.id] = value;
                $scope.shortnameidmap[value.code] = value.id;
            })

        });
    };

})();


