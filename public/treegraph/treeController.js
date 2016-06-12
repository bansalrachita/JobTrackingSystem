/**
 * Created by rachita on 6/6/16.
 */
(function () {
    angular
        .module("Map")
        .controller("treeCtrl", ['$http', '$scope', treeController]);

    function treeController($http, $scope) {
        var vm = this;

        $http.get('data/treedata.json').then(function (response) {
            vm.treeData = response.data;
            vm.treeDataOrig = angular.copy(vm.treeData);
            vm.states = angular.copy(vm.treeDataOrig.children);
            console.log(vm.treeDataOrig);
            return response.data;
        }, function (err) {
            throw err;
        });

        $http.get('data/applicant-data.json').then(function (response) {
            vm.applicantsData = response.data;
            vm.applicantsDataOrig = angular.copy(vm.applicantsData);
            // console.log(vm.applicantsData);
        }, function (err) {
            throw err;
        });

        vm.selectcity = function (s) {
            vm.cities = [];
            // console.log(s);
            // console.log(s.children);
            if (s && s.children) {
                angular.forEach(s.children, function (value, key) {
                    vm.cities.push(value);
                });
            }
            console.log(vm.cities);
        };

        vm.selectUniv = function (s) {
            vm.univs = [];
            // console.log(s);
            // console.log(s.children);
            if (s != null && s.children) {
                angular.forEach(s.children, function (value, key) {
                    vm.univs.push(value);
                });
                console.log(vm.univs);
            }

        };

        vm.submit = function (state, city, univ) {
            vm.subArray = [];
            vm.smalltreeData = {
                "name": vm.treeData.name,
                "children": []
            };
            vm.applicantsData = angular.copy(vm.applicantsDataOrig);
            vm.treeData = angular.copy(vm.treeDataOrig);

            if (state && state.name) {
                console.log(state.name);
                angular.forEach(vm.treeData.children, function (vState, key) {
                    if (vState.name == state.name) {
                        if (city && city.name) {
                            //add states
                            console.log(city.name);
                            vm.smalltreeData.children.push({
                                "name": state.name,
                                "_children": []
                            });
                            console.log(vState);
                            angular.forEach(vState.children, function (vCity, cKey) {
                                if (vCity.name == city.name) {
                                    var countState = 0;
                                    console.log(vm.smalltreeData.children[0].name);
                                    vm.smalltreeData.children[countState]._children.push({
                                        "name": city.name,
                                        "_children": []
                                    });
                                    var countCity = 0;
                                    if (univ && univ.name) {
                                        console.log(univ.name);
                                        angular.forEach(vCity.children, function (vUniv, uKey) {
                                            if (vUniv.name == univ.name) {
                                                vm.smalltreeData.children[countState]._children[countCity]._children.push(vUniv);
                                            }
                                            countCity++;
                                        });
                                        angular.forEach(vm.applicantsData, function (value, key) {
                                            console.log(value.State + " :");
                                            if (null != value.City && value.State.toLowerCase() == state.name.toLowerCase()
                                                && value.City.toLowerCase() == city.name.toLowerCase()
                                                && value.University.toLowerCase() == univ.name.toLowerCase()) {
                                                vm.subArray.push(value);
                                                console.log(vm.treeData);
                                            }
                                        });
                                    } else {
                                        angular.forEach(vCity.children, function (vUniv, uKey) {
                                            vm.smalltreeData.children[countState]._children[countCity]._children.push(vUniv);
                                        });
                                        angular.forEach(vm.applicantsData, function (value, key) {
                                            // console.log(value.State + " :");
                                            if (null != value.City && value.State.toLowerCase() == state.name.toLowerCase()
                                                && value.City.toLowerCase() == city.name.toLowerCase()) {
                                                vm.subArray.push(value);
                                            }
                                        });
                                    }
                                }
                                countState++;
                            });

                        } else {
                            vm.smalltreeData.children.push(vState);
                            angular.forEach(vm.applicantsData, function (value, key) {
                                if (value.State.toLowerCase() == state.name.toLowerCase()) {
                                    vm.subArray.push(value);
                                }
                            });
                        }
                    }
                });
                console.log(vm.smalltreeData);
                vm.treeData = angular.copy(vm.smalltreeData);
                vm.applicantsData = angular.copy(vm.subArray);
            }

        };

        vm.profile = function (applicant) {

            console.log(applicant);
        };

        vm.getMaxLength = function () {
            return 130;
        }
        vm.style = "treegraph/treeStyle";
    }

})();

