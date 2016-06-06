/**
 * Created by rachita on 6/6/16.
 */
(function () {
    angular
        .module("Map")
        .controller("homeCtrl", homeController);
    
    function homeController($location) {
        var vm = this;

        vm.displaymap = function(){
            $location.url("/pages/map");
        }

        vm.displaytree = function(){
            $location.url("/pages/tree");
        }
    }

    })();
