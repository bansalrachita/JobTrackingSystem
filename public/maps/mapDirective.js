/**
 * Created by rachita on 5/31/16.
 */
(function () {
    angular
        .module("Map")
        .directive("myMap", myMap);

    function myMap() {
        function link(scope, element, attr) {
            console.log('here', scope);

            var state_ids = [0];
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
                    .classed("active", centered && function (d) {
                            return d === centered;
                        });

                g.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                    .style("stroke-width", 1.5 / k + "px");
            }

            scope.$watch('land', function (geo) {
                if (!geo) return;

                land.data(geo)
                    .attr("id", "states")
                    .attr('class', 'land')
                    .enter().append("path")
                    .attr('d', path)
                    .attr("id", function (d) {
                        state_ids.push(+d.id);
                        id_state_map[d.id] = scope.idnamemap[d.id].name;
                        id_topo_map[d.id] = d;
                        return "map-" + d.id;
                    }).text(function (d) {
                    return id_state_map[d];
                })
                    .on("click", clicked);

                text.data(geo)
                    .enter()
                    .append("svg:text")
                    .text(function (d) {
                        return id_state_map[d.id];
                    })
                    .attr("x", function (d) {
                        return !isNaN(path.centroid(d)[0]) ? path.centroid(d)[0] : 0;
                    })
                    .attr("y", function (d) {
                        return !isNaN(path.centroid(d)[1]) ? path.centroid(d)[1] : 0;
                    })
                    .attr("text-anchor", "middle")
                    .attr('font-size', '6pt');
            });

            scope.$watch('boundary', function (geo) {
                if (!geo) return;

                boundary.datum(geo).attr("class", "boundary").attr("id", "state-borders").attr("d", path);
            });

        }

        return {
            link: link,
            restrict: 'E',
            scope: {land: '=', boundary: '=', idnamemap: '=', shortnameidmap: '='}
        }

    }


})();


