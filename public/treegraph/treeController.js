/**
 * Created by rachita on 6/6/16.
 */
(function () {
    angular
        .module("Map")
        .controller("treeCtrl", ['$http', treeController]);

    function treeController($http) {
        var vm = this;

        $http.get('data/treedata.json').then(function (response) {
            vm.treeData = response.data;
            console.log(vm.treeData);
        }, function (err) {
            throw err;
        });

        vm.style = "treegraph/treeStyle";
    }

})();

