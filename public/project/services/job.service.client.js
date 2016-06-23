(function(){
    angular
        .module("JobTracker")
        .factory("JobService", ['$http','UserService', 'ApplicationService', JobService]);

    function JobService($http, UserService, ApplicationService){
        var api = {
            findAllJobs: findAllJobs,
            findJobByCId: findJobByCId,
            addJob: addJob,
            findJobByRole: findJobByRole,
            findJobByJId: findJobByJId,
            updateJob: updateJob,
            deleteJob: deleteJob
        };
        return api;


        function deleteJob(jid){
            console.log("JobService:Client deleteJob ", jid);
            var url = "/api/job/" + jid;
            return $http.delete(url);
        }

        function updateJob(newJob){
            console.log("JobService:Client updateJob ", newJob);
            var url = "/api/job/" + newJob.jid;
            return $http.put(url, newJob);
        }
        function findAllJobs(){
            // return lstJobs;
            console.log("JobService:Client finding jobs");
            var url = "/api/job";
            return $http.get(url);
        }

        function addJob(newJob){
            console.log("JobService:Client addJob, job received ", newJob);
            return $http.post("/api/job", newJob);
        }

        function findJobByCId(cid){
            console.log("JobService:Client findJobByCId cid=", cid);
            var url = "/api/job?cid=" + cid;
            return $http.get(url);
        }

        function findJobByJId(jid){
            console.log("JobService:Client findJobByJId by jid=", jid);
            var url = "/api/job?jid="+jid;
            return $http.get(url);
        }

        function findJobByRole(cid, role){
            console.log("JobService:Client findJobByRole cid=" , cid, " role=",  role);
            if(role == "user"){
                console.log("JobService:Client findJobByRole all jobs");
                var url = "/api/job";
                return $http.get(url);
            }else{
                console.log("JobService:Client findJobByRole for cid=", cid);
                var url = "/api/job?cid=" + cid;
                return $http.get(url);
            }
        }

    }
})();