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
            // console.log(vm.cities);
        };

        vm.selectUniv = function (s) {
            vm.univs = [];
            // console.log(s);
            // console.log(s.children);
            if (s != null && s.children) {
                angular.forEach(s.children, function (value, key) {
                    vm.univs.push(value);
                });
                // console.log(vm.univs);
            }

        };

        vm.submit = function (state, city, univ) {
            vm.subArray = [];
            vm.smalltreeData = {};
            vm.applicantsData = angular.copy(vm.applicantsDataOrig);
            vm.treeData = angular.copy(vm.treeDataOrig);

            if (state && state.name && city && city.name && univ && univ.name) {
                angular.forEach(vm.treeData.children, function (vState, key) {
                    if (vState.name.toLowerCase() == state.name.toLowerCase()) {
                        angular.forEach(vState.children, function (vCity, cKey) {
                            if (vCity.name.toLowerCase() == city.name.toLowerCase()) {
                                angular.forEach(vCity.children, function (vUniv, uKey) {
                                    if (vUniv.name.toLowerCase() == univ.name.toLowerCase()) {
                                        vm.smalltreeData = angular.copy(vUniv);
                                    }
                                });

                                //applicants data
                                angular.forEach(vm.applicantsData, function (value, key) {
                                    if (null != value.City && value.State.toLowerCase() == state.name.toLowerCase()
                                        && value.City.toLowerCase() == city.name.toLowerCase()
                                        && value.University.toLowerCase() == univ.name.toLowerCase()) {
                                        vm.subArray.push(value);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else if (state && state.name && city && city.name) {
                angular.forEach(vm.treeData.children, function (vState, key) {
                    if (vState.name.toLowerCase() == state.name.toLowerCase()) {
                        angular.forEach(vState.children, function (vCity, cKey) {
                            if (vCity.name.toLowerCase() == city.name.toLowerCase()) {
                                vm.smalltreeData = angular.copy(vCity);
                            }
                        });

                        //applicants data
                        angular.forEach(vm.applicantsData, function (value, key) {
                            if (null != value.City && null != value.State
                                && value.State.toLowerCase() == vState.name.toLowerCase()
                                && value.City.toLowerCase() == city.name.toLowerCase()) {
                                vm.subArray.push(value);
                            }
                        });
                    }
                });
            }
            else if (state && state.name) {
                angular.forEach(vm.treeData.children, function (vState, key) {
                    if (vState.name.toLowerCase() == state.name.toLowerCase()) {
                        console.log(vState);
                        vm.smalltreeData = angular.copy(vState);
                    }
                });

                //applicants data
                angular.forEach(vm.applicantsData, function (value, key) {
                    if (null != value.State
                        && value.State.toLowerCase() == state.name.toLowerCase()) {
                        vm.subArray.push(value);
                    }
                });

            } else {
                vm.smalltreeData = angular.copy(vm.treeData);
                vm.subArray = angular.copy(vm.applicantsData);
            }

            console.log(vm.smalltreeData);
            vm.treeData = angular.copy(vm.smalltreeData);
            vm.applicantsData = angular.copy(vm.subArray);
            
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

