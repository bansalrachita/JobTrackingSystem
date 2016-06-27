(function () {
        angular
            .module("JobTracker")
            .filter("searchJob", searchJob);

        function searchJob() {
            return function(jobs, searchString){
                console.log("filter", jobs, searchString);
                if (!searchString) {
                    return jobs;
                }
                var result = [];
                searchString = searchString.toLowerCase();
                angular.forEach(jobs, function (job) {
                    if (job.title.toLowerCase().indexOf(searchString) !== -1) {
                        result.push(job);
                    }
                    else if(job._id.toLowerCase().indexOf(searchString) !== -1){
                        result.push(job);
                    }
                    else if(job.location.toLowerCase().indexOf(searchString) !== -1){
                        result.push(job);
                    }
                    else if(job.cname.toLowerCase().indexOf(searchString) !== -1){
                        result.push(job);
                    }
                    else {
                        for(var i in job.skills){
                            if(job.skills[i].toLowerCase().indexOf(searchString) !== -1){
                                result.push(job);
                            }
                        }
                    }
                });

                return result;
            };

        }

    })();


