(function () {
    angular
        .module("JobTracker")
        .directive("myMap", myMap);

    function myMap(mapService, $rootScope, chartService, ApplicationService) {
        function link(scope, element, attr) {
            // console.log('here', scope);

            var state_ids = [0];
            var id_state_map = {
                0: ""
            };
            var id_topo_map = {
                0: null
            };

            var c10 = d3.scale.category10();

            var width = 700,
                height = 600,
                centered;

            var projection = d3.geo.albersUsa()
                .scale(width)
                .translate([width / 2, height / 2]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#usaMap").select("svg")
                .attr("width", width)
                .attr("height", height);

            var g = svg.append("g");
            var land = g.append("g").attr("id", "states").selectAll("path");
            var boundary = g.append('path');
            var text = g.selectAll('text');
            var tooltip = d3.select("#usaMap").append('div')
                .attr('class', 'hidden tooltip');
            var validStates = [];
            var numberOfApplicants = [];
            var legend_labels = [];
            var legendData = [];

            function validState() {
                ApplicationService
                    .findApplicantDataForMap(scope.jobid)
                    .then(function (response) {
                        validStates = [];
                        numberOfApplicants = [];
                        legend_labels = [];
                        legendData = [];

                        console.log("MapDirective ApplicationService", scope.jobid);
                        var applicantDataFromService = response.data;
                        applicantData = applicantDataFromService["applicantData"];
                        skillsData = applicantDataFromService["skillsData"];
                        angular.forEach(applicantData, function (value, key) {

                            if (value.State && validStates.indexOf(value.State) == -1) {
                                validStates.push(value.State);
                                numberOfApplicants[value.State] = value.value;
                            }
                            else if (value.State in numberOfApplicants) {
                                numberOfApplicants[value.State] += value.value;
                            }
                        });

                        for (var i in numberOfApplicants) {
                            legend_labels.push({state: i, value: numberOfApplicants[i]});
                        }

                        angular.forEach(legend_labels, function (value, key) {
                            legendData.push(value.value);
                        });

                    }, function (err) {
                        console.log("MapDirective Service ApplicationService error", scope.jobid);
                    });
            }

            validState();

            function clicked(d, state) {
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

                if (centered === null) {
                    mapService.getChart();
                    mapService.getChart1();
                } else {
                    // console.log("state: " + state);
                    // console.log("*jobId " + scope.jobId);
                    var serviceObj = clickMap(state, scope.jobid);
                    // console.log("serviceObj " + serviceObj);
                }

            }


            function clickMap(state, jid) {
                // console.log("click map " + jid);
                var chartData = [];
                var skillData = [];
                var applicantData, skillsData;

                ApplicationService
                    .findApplicantDataForMap(jid)
                    .then(function (response) {
                        console.log("MapService clickMap ApplicationService findApplicationDataForMap success", jid);
                        var applicantDataFromService = response.data;
                        applicantData = applicantDataFromService["applicantData"];
                        console.log(applicantData);
                        angular.forEach(applicantData, function (value, key) {
                            if (value.State == state) {
                                chartData.push(value);
                            }
                        });
                        skillsData = applicantDataFromService["skillsData"];
                        angular.forEach(skillsData, function (value, key) {
                            if (value.State == state) {
                                skillData.push(value);
                            }
                        });

                        // console.log(chartData);
                        // console.log(skillData);
                    }, function (err) {
                        console.log("MapService clickMap ApplicationService findApplicationDataForMap error", jid);
                    }).then(function (chartData, skillData) {
                    chartService
                        .setChart1(skillData, $rootScope);
                    chartService
                        .setChart(chartData, $rootScope);
                }, function (err) {
                    console.log("char service faulted");
                });

                if (skillData.length == 0 || chartData.length == 0) {
                    chartService
                        .setChart1(skillData, $rootScope);
                    chartService
                        .setChart(chartData, $rootScope);
                }


                return {chartData: chartData, chart1Data: skillData};
            }


            scope.$watch('land', function (geo) {
                validState();
                if (!geo) return;

                validState();

                land.data(geo)
                    .attr("id", "states")
                    .attr('class', 'land')
                    .enter().append("path")
                    .attr('d', path)
                    .attr("id", function (d) {
                        state_ids.push(+d.id);
                        id_state_map[d.id] = scope.idnamemap[d.id];
                        id_topo_map[d.id] = d;
                        return "map-" + d.id;
                    })
                    .attr("fill", function (d) {
                        if (validStates && validStates.indexOf(id_state_map[d.id].name) !== -1) {
                            return c10(numberOfApplicants[scope.idnamemap[d.id].name]);
                            // return d3.rgb("#" + (numberOfApplicants[scope.idnamemap[d.id].name] + 700));
                        }
                    })
                    .on("click", function (d) {
                        return clicked(d, id_state_map[d.id].name)
                    })
                    .on('mousemove', function (d) {
                        var mouse = d3.mouse(g.node()).map(function (d) {
                            return parseInt(d);
                        });
                        tooltip.classed('hidden', false)
                            .attr('style', 'left:' + (mouse[0] + 15) +
                                'px; top:' + (mouse[1] - 35) + 'px')
                            .html(scope.idnamemap[d.id].name)
                        ;
                    })
                    .on('mouseout', function () {
                        tooltip.classed('hidden', true);
                    });

                text.data(geo)
                    .enter()
                    .append("svg:text")
                    .text(function (d) {
                        if (validStates && validStates.indexOf(id_state_map[d.id].name) !== -1) {
                            // console.log("valid states : ", validStates, id_state_map[d.id]);
                            return id_state_map[d.id].code;
                        }
                        // else {
                        //     return id_state_map[d.id].code;
                        // }
                    })
                    .attr("x", function (d) {
                        return !isNaN(path.centroid(d)[0]) ? path.centroid(d)[0] : 0;
                    })
                    .attr("y", function (d) {
                        return !isNaN(path.centroid(d)[1]) ? path.centroid(d)[1] : 0;
                    })
                    .attr("text-anchor", "middle")
                    .attr('font-size', '6pt')
                    .attr('fill', 'white');


                var ls_w = 30, ls_h = 30;

                var legend = svg.selectAll("g.legend")
                    .data(legendData)
                    .enter().append("g")
                    .attr("class", "legend");

                legend.append("rect")
                    .attr("x", 30)
                    .attr("y", function (d, i) {
                        return height - (i * ls_h) - 2 * ls_h;
                    })
                    .attr("width", ls_w)
                    .attr("height", ls_h)
                    .style("fill", function (d, i) {
                        return c10(legend_labels[i].value);
                        // return d3.rgb("#" + (legend_labels[i].value + 700));
                    })
                    .style("opacity", 0.8);

                legend.append("text")
                    .attr("x", 70)
                    .attr("y", function (d, i) {
                        return height - (i * ls_h) - ls_h - 4;
                    })
                    .text(function (d, i) {
                        return legend_labels[i].value + " Applications";
                    });

            });

            scope.$watch('boundary', function (geo) {
                if (!geo) return;
                boundary.datum(geo).attr("class", "boundary").attr("id", "state-borders").attr("d", path);
            });

        }

        return {
            link: link,
            restrict: 'E',
            scope: {land: '=', boundary: '=', idnamemap: '=', shortnameidmap: '=', jobid: '='}
        }

    }


})();


