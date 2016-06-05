(function () {
    angular
        .module("Map")
        .controller("mapCtrl", mapCtrl);

    function mapCtrl($scope, $http,$window) {
        $http.get('data/usdata.json').then(function (response) {
            // $scope.mapus = response.data;
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
        $scope.layout = 'maps/mapStyle';
    };

})();


