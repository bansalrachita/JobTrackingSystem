/**
 * Created by rachita on 5/31/16.
 */
(function () {
    angular
        .module("Map")
        .directive("regionChart", regionChart);

    function regionChart($http, chartService) {
        function link(scope, element, attr) {
            nv.addGraph(function () {
                var width = 100;
                var height = 100;
                var svg = d3.select("#" + scope.id).append("svg")
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
                        .labelType("key") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                        .donutRatio(0.25)//Configure how big you want the donut hole size to be.
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
