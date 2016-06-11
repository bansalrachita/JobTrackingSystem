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
            vm.treeDataOrig = response.data;
            vm.states = vm.treeData.children;
            console.log(vm.treeData);
            return response.data;
        }, function (err) {
            throw err;
        });

        $http.get('data/applicant-data.json').then(function (response) {
            vm.applicantsData = response.data;
            vm.applicantsDataOrig = angular.copy(vm.applicantsData);
            console.log(vm.applicantsData);
        }, function (err) {
            throw err;
        });

        vm.selectcity = function (s) {
            vm.cities = [];
            console.log(s);
            // console.log(s._children);
            if (s._children) {
                angular.forEach(s._children, function (value, key) {
                    vm.cities.push(value);
                });
            }
            console.log(vm.cities);
        };

        vm.selectUniv = function (s) {
            vm.univs = [];
            // console.log(s);
            // console.log(s._children);
            if (s != null && s._children) {
                angular.forEach(s._children, function (value, key) {
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

            if (state.name) {
                console.log(state && state.name);
                angular.forEach(vm.treeData.children, function (vState, key) {
                    if (vState.name == state.name) {
                        //add states
                        vm.smalltreeData.children.push({
                            "name": vState.name,
                            "_children": []
                        });
                        if (city && city.name) {
                            console.log(city.name);
                            console.log(vState);
                            angular.forEach(vState._children, function (vCity, cKey) {
                                if (vCity.name == city.name) {
                                    var countState = 0;
                                    console.log(vm.smalltreeData.children[0].name);
                                    vm.smalltreeData.children[countState]._children.push({
                                        "name": vCity.name,
                                        "_children": []
                                    });
                                    if (univ && univ.name) {
                                        console.log(univ.name);
                                        var countCity = 0;
                                        angular.forEach(vCity._children, function (vUniv, uKey) {
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
                                        vm.smalltreeData.children.push(vState);
                                        vm.subArray = vm.applicantsData;
                                    }
                                }
                                countState++;
                            });

                        } else {
                            vm.smalltreeData.children.push(vState);
                            vm.subArray = vm.applicantsData;
                        }
                    }
                });
            }

            console.log(vm.smalltreeData);
            vm.treeData = angular.copy(vm.smalltreeData);

            // if (city.name) {
            //     console.log(city.name);
            //     if (univ.name) {
            //         console.log(univ.name);
            //         angular.forEach(vm.applicantsData, function (value, key) {
            //             console.log(value.State + " :");
            //             if (null != value.City && value.State.toLowerCase() == state.name.toLowerCase()
            //                 && value.City.toLowerCase() == city.name.toLowerCase()
            //                 && value.University.toLowerCase() == univ.name.toLowerCase()) {
            //                 vm.subArray.push(value);
            //                 console.log(vm.treeData);
            //             }
            //         });
            //     } else {
            //         vm.subArray = vm.applicantsData;
            //     }
            // }
            // else {
            //     vm.subArray = vm.applicantsData;
            // }
            vm.applicantsData = angular.copy(vm.subArray);
        };


        vm.profile = function (applicant) {
            console.log(applicant);
        };

        vm.selected = "no Selection";
        vm.selectedCity = "Select City";
        vm.selectedUniv = "Select University";
        vm.style = "treegraph/treeStyle";
    }

})();

