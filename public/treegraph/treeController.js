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
            vm.states = vm.treeData.children;
            console.log(vm.states[0].children);
        }, function (err) {
            throw err;
        });

        vm.selectcity = function (s) {
            vm.cities = [];
            console.log(s);
            console.log(s._children);
            angular.forEach(s._children, function (value, key) {
                vm.cities.push(value);
            });
            console.log(vm.cities);
        };

        vm.selectskill = function (s) {
            vm.skills = [];
            console.log(s);
            console.log(s._children);
            if (s._children) {
                angular.forEach(s._children, function (value, key) {
                    vm.skills.push(value);
                });
                console.log(vm.skills);
            }

        };

        vm.submit = function (state, city, skill) {
            console.log(state, city, skill);
        }


        console.log(vm.cities);
        vm.selected = "no Selection";
        vm.selectedCity = "Select City";
        vm.selectedSkills = "Select Skils";
        vm.style = "treegraph/treeStyle";
    }

})();

