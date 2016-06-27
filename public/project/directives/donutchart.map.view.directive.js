
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

                var c10 = d3.scale.category10();

                var counter = 0;

                var counterCheck = function(counter){
                    counter += 1;
                    return counter;
                };
                var chart = nv.models.pieChart()
                        .x(function (d) {
                           return d.label;
                        })
                        .y(function (d) {
                            return d.value;
                        })
                        .showLabels(true)//Display pie labels
                        .showLegend(false)
                        .labelThreshold(.15)  //Configure the minimum slice size for labels to show up
                        .labelType("key") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                        .donutRatio(0.5)
                        .color(function (d) {
                            return c10(d.value);
                        })//Configure how big you want the donut hole size to be.
                    ;

                // d3.select(".nv-legendWrap")
                //     .attr("transform", "translate(0,-100)");

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
