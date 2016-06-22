
(function () {
    angular
        .module("JobTracker")
        .directive("regionChart", regionChart);

    function regionChart($http, chartService) {
        function link(scope, element, attr) {
            nv.addGraph(function () {
                var width = 100;
                var height = 100;
                var svg = d3.select("#" + scope.id).append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var myColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
                d3.scale.myColors = function() {
                    return d3.scale.ordinal().range(myColors);
                };

                var chart = nv.models.pieChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .showLabels(true)     //Display pie labels
                        .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                        .labelType("key") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                        .donutRatio(0.25)
                        .color(d3.scale.myColors().range())//Configure how big you want the donut hole size to be.
                    ;

                scope.$watch('data', function (data) {
                    // console.log('redraw :', data);
                    if (data) {
                        svg.datum(data)
                            .transition().duration(350)
                            .call(chart);
                    }
                }, true);
            });
        }

        return {
            link: link,
            restrict: 'E',
            scope: {data: "=", id: "@"}
        }

    }

})();
