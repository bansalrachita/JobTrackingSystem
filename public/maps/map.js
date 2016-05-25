/**
 * Created by rachita on 5/23/16.
 */

var app= angular.module('Map',['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'maps/map.html',
            controller: 'mapCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.directive('myMap', function(){
    console.log("hi");
    function link(scope,element,attr){
        console.log('here', scope);

        var width = 960,
            height = 500,
            centered;

        var projection = d3.geo.albersUsa()
            .scale(1070)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        var svg = d3.select(element[0]).append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .on("click", clicked);

        var g = svg.append("g");
        var land = g.append("g").attr("id", "states").selectAll("path");
        var boundary = g.append('path');

        function clicked(d) {
            var x, y, k;

            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
            }

            g.selectAll("path")
                .classed("active", centered && function(d) { return d === centered; });

            g.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px");
        }

        scope.$watch('land', function(geo){
            if(!geo) return;

            land.data(geo).attr('class', 'land').enter().append("path").attr('d', path).attr("id", "states").on("click", clicked);

        });
        scope.$watch('boundary', function(geo){
            if(!geo) return;

            boundary.datum(geo).attr("class", "boundary").attr("id", "state-borders").attr("d", path);
        });

    }
    return{
        link:link,
        restrict: 'E',
        scope: {land: '=', boundary: '='}
    }
});

app.controller('mapCtrl', function ($scope, $http) {
    $http.get('data/usdata.json').then(function(response){
        // $scope.mapus = response.data;
        $scope.land = topojson.feature(response.data, response.data.objects.states).features;
        $scope.boundary = topojson.mesh(response.data, response.data.objects.states, function(a, b) { return a !== b; });
        // console.log($scope.land);
        // console.log($scope.boundary);
    }, function (err) {
        throw err;
    });

    $scope.layout = 'maps/mapstyle';

});

