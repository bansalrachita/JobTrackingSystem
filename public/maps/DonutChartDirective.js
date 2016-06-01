/**
 * Created by rachita on 5/31/16.
 */
(function () {
    angular
        .module("Map")
        .directive("regionChart", regionChart);

    function regionChart() {
        function link(scope, element, attr) {
            nv.addGraph(function () {
                var width = 100;
                var height = 100;
                var svg = d3.select("#regionDiv").append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var chart = nv.models.pieChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .showLabels(true)     //Display pie labels
                        .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                        .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                        .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                    ;

                // var pie = function(d){return d};

                console.log(scope.data);
                scope.$watch('data', function (data) {
                    svg.datum(data)
                        .transition().duration(350)
                        .call(chart);
                });

            });
        }
            return {
                link: link,
                restrict: 'E',
                scope: {data: '='}
            }


    };

})();
