(function () {
    angular
        .module("JobTracker")
        .filter("searchApplicant", searchApplicant);

    function searchApplicant() {
        return function(applicants, searchString){
            console.log("filter", applicants, searchString);
            if (!searchString || searchString === "All") {
                return applicants;
            }
            var result = [];
            searchString = searchString.toLowerCase();
            angular.forEach(applicants, function (applicant) {
                if (applicant.spl && applicant.spl.toLowerCase().indexOf(searchString) !== -1) {
                    result.push(applicant);
                }
            });

            return result;
        };
    }

})();
