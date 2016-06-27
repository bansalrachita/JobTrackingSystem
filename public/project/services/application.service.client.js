(function(){
    angular
        .module("JobTracker")
        .factory("ApplicationService", ApplicationService);

    var unique_id = 456;
    
    function ApplicationService($http){
        var api = {
            applyJobIdWithApplication: applyJobIdWithApplication,
            createJobApplication: createJobApplication,
            findApplicationById: findApplicationById,
            findApplied: findApplied,
            findApplicantDataForMap: findApplicantDataForMap,
            aggregateDegreesForJID: aggregateDegreesForJID,
            aggregateSkillsForJID: aggregateSkillsForJID,
            deleteApplication: deleteApplication
        };
        return api;

        function deleteApplication(jid){
            console.log("ApplicationService:Client deleteApplication for jid=", jid);
            var url = "/api/"+ jid +"/application";
            return $http.delete(url);
        }


        function createJobApplication(application){
            var jid = application.jobId;
            console.log("ApplicationService:Client createJobApplication" +
                " ", application, " for jid=", jid);

            var url = "/api/"+ jid +"/application";
            return $http.post(url, application);

        }

        function findApplicationById(applicationId){
            console.log("ApplicationService:Client findApplicationById jid=", applicationId);
            var url = "/api/application?aid="+applicationId;
            return $http.get(url);
        }

        function applyJobIdWithApplication(jobId, userId, applicationDetails){
            console.log("ApplicationService:Client applyJobIdWithApplication to jobId=" + jobId + " for uid=" + userId);
            console.log(applicationDetails);

            var url = "/api/application?uid="+userId+"&jid=" + jobId;
            return $http.post(url, applicationDetails);
        }
        // TODO: findApplied as true before now it returns application
        function findApplied(jobId, userId){
            console.log("ApplicationService:Client findApplication " + userId + " " + jobId);
            var url = "/api/application?uid=" + userId + "&jid=" + jobId;
            return $http.get(url);
        }

        function aggregateDegreesForJID(jid){
            console.log("ApplicationService:Client aggregateDegreesForJID jid" + jid );
            var url = "/api/application/degree/" + jid;
            return $http.get(url);
        }

        function aggregateSkillsForJID(jid){
            console.log("ApplicationService:Client aggregateSkillsForJID jid" + jid );
            var url = "/api/application/skills/" + jid;
            return $http.get(url);
        }
        function findApplicantDataForMap(jid){
            console.log("ApplicationService:Client findApplicantDataForMap jid" + jid );
            var url = "/api/application/map/" + jid;
            return $http.get(url);
        }

    }
})();