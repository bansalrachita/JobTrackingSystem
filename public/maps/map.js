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

    function link(scope,element,attr){
        console.log('here', scope);

        var state_ids = [ 0 ];
        var id_state_map = {
            0: ""
        };
        var id_topo_map = {
            0: null
        };

        var width = 960,
            height = 500,
            centered;

        var projection = d3.geo.albersUsa()
            .scale(1070)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        var svg = d3.select("#usaMap").append("svg")
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
        var text = g.selectAll('text');

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

            land.data(geo)
                .attr("id", "states")
                .attr('class', 'land')
                .enter().append("path")
                .attr('d', path)
                .attr("id", function(d) {
                    state_ids.push(+d.id);
                    id_state_map[d.id] = scope.idnamemap[d.id].name;
                    id_topo_map[d.id] = d;
                    return "map-" + d.id;
                }).text(function(d) {
                    return id_state_map[d];
                })
                .on("click", clicked);

                text.data(geo)
                    .enter()
                    .append("svg:text")
                    .text(function(d){
                        return id_state_map[d.id];
                    })
                    .attr("x", function(d){
                        return  !isNaN(path.centroid(d)[0])?path.centroid(d)[0]:0;
                    })
                    .attr("y", function(d){
                        return  !isNaN(path.centroid(d)[1])?path.centroid(d)[1]:0;
                    })
                    .attr("text-anchor","middle")
                    .attr('font-size','6pt');
            });

        scope.$watch('boundary', function(geo){
            if(!geo) return;

            boundary.datum(geo).attr("class", "boundary").attr("id", "state-borders").attr("d", path);
        });

    }
    return{
        link:link,
        restrict: 'E',
        scope: {land: '=', boundary: '=', idnamemap: '=', shortnameidmap: '='}
    }
});

app.directive('regionChart', function(){
    function link(scope, element, attr) {
        nv.addGraph(function() {
            var chart = nv.models.pieChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .showLabels(true)     //Display pie labels
                    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                    .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                ;

           // var pie = function(d){return d};

            console.log(scope.data);
            scope.$watch('data', function(data){
                d3.select("#regionDiv")
                    .datum(data)
                    .transition().duration(350)
                    .call(chart);
            });


            // return chart;
        });
    }return{
        link: link,
        restrict: 'E',
        scope: {data: '='}
    }
});

app.controller('mapCtrl', function ($scope, $http) {
    $http.get('data/usdata.json').then(function(response){
        // $scope.mapus = response.data;
        $scope.land = topojson.feature(response.data, response.data.objects.states).features;
        $scope.boundary = topojson.mesh(response.data, response.data.objects.states, function(a, b) { return a !== b; });
    }, function (err) {
        throw err;
    });

    $http.get('data/us-states.json').then(function(response){
        $scope.idnamemap = {
            // 0: null
        };

        $scope.shortnameidmap = {
            // 0: null
        };
        angular.forEach(response.data, function(value, key){
            $scope.idnamemap[value.id] = value;
            $scope.shortnameidmap[value.code] = value.id;
        })

    });

    $http.get('data/chart.json').then(function(response){
        $scope.chart = {
            value: response.data
        }
        // console.log("chart", $scope.chart.value);
    }, function (err) {
        throw err;
    });

    $scope.layout = 'maps/mapstyle';

});

// app.controller('chartCtrl', function ($scope, $http) {
//     $http.get('data/chart.json').then(function(response){
//         $scope.chart = {
//             value: response.data
//         }
//         console.log("chart", $scope.chart.value);
//     }, function (err) {
//         throw err;
//     });
// });


