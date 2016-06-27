(function () {
    angular
        .module("JobTracker")
        .controller("TreeController", TreeController);

    function TreeController($stateParams, TreeService,JobService) {
        var vm = this;
        vm.userId = $stateParams.uid;
        vm.jobId = $stateParams.jid;

        console.log("inside treeController for uid=" + vm.userId + " with " + vm.jobId);

        function init(){
            JobService
                .findJobByJId(vm.jobId)
                .then(function (response) {
                    console.log("JobService findJobByJId success");
                    vm.job = response.data;
                    return vm.jobId;
                }, function (err) {
                    console.log("JobService error", err);
                });
        }
        init();

        TreeService.drawTree(vm.jobId).then(
            function (response) {
                vm.treeData = response.data;
                vm.treeDataOrig = angular.copy(vm.treeData);
                vm.states = angular.copy(vm.treeDataOrig.children);
                console.log(vm.treeDataOrig);
                // return response.data;
            }, function (err) {
                console.log("TreeService err ");
            });

        TreeService.getApplicants(vm.jobId).then(
            function (response) {
                vm.applicantsData = response.data;
                vm.applicantsDataOrig = angular.copy(vm.applicantsData);
            }, function (err) {
                console.log("TreeService err in getApplicants");
            }
        );

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
                                    if (null != value.city && value.state.toLowerCase() == state.name.toLowerCase()
                                        && value.city.toLowerCase() == city.name.toLowerCase()
                                        && value.university.toLowerCase() == univ.name.toLowerCase()) {
                                        vm.subArray.push(value);
                                    }
                                    console.log("applicants data", vm.subArray);
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
                            if (null != value.city && null != value.state
                                && value.state.toLowerCase() == vState.name.toLowerCase()
                                && value.city.toLowerCase() == city.name.toLowerCase()) {
                                vm.subArray.push(value);
                            }
                            console.log("applicants data out", vm.subArray);
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
                    if (null != value.state
                        && value.state.toLowerCase() == state.name.toLowerCase()) {
                        vm.subArray.push(value);
                    }
                });
                console.log("applicants data", vm.subArray);

            } else {
                vm.smalltreeData = angular.copy(vm.treeData);
                vm.subArray = angular.copy(vm.applicantsData);
            }

            console.log(vm.smalltreeData);
            vm.treeData = angular.copy(vm.smalltreeData);
            vm.applicantsData = angular.copy(vm.subArray);

        };

        vm.getMaxLength = function () {
            return 200;
        };
    }

})();

