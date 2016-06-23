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
            //
            // for(var i in applications){
            //     if(applications[i].jobId == jobId){
            //         console.log(applications[i]);
            //         applications[i].foreignUserId.push(parseInt(userId));
            //         // applications[i].lstApplications.push(applicationDetails);
            //     }
            // }
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
            // var currentApplication = findApplicationById(jid);
            // var aggData = [];
            // if(currentApplication && currentApplication.lstApplications){
            //     for(var idx in currentApplication.lstApplications){
            //         var application = currentApplication.lstApplications[idx];
            //         var flag = false;
            //         for(var jdx in aggData){
            //             if(aggData[jdx].label == application.degree){
            //                 aggData[jdx].value = aggData[jdx].value + 1;
            //                 flag = true;
            //             }
            //         }
            //         if(!flag){
            //             aggData.push({ label : application.degree, value: 1});
            //         }
            //     }
            // }
            // console.log("aggregateDegreesForJID");
            // console.log(aggData);
            // return aggData;
        }

        function aggregateSkillsForJID(jid){
            console.log("ApplicationService:Client aggregateSkillsForJID jid" + jid );
            var url = "/api/application/skills/" + jid;
            return $http.get(url);
            // var currentApplication = findApplicationById(jid);
            // var aggData = [];
            // if(currentApplication && currentApplication.lstApplications){
            //     for(var idx in currentApplication.lstApplications){
            //         var application = currentApplication.lstApplications[idx];
            //
            //         for(var kdx in application.skills){
            //             var flag = false;
            //             for(var jdx in aggData) {
            //                 if (aggData[jdx].label == application.skills[kdx]) {
            //                     aggData[jdx].value = aggData[jdx].value + 1;
            //                     flag = true;
            //                     break;
            //                 }
            //             }
            //             if(!flag){
            //                 aggData.push({ label : application.skills[kdx], value: 1});
            //             }
            //         }
            //     }
            // }
            // console.log("aggregateSkillsForJID");
            // console.log(aggData);
            // return aggData;
        }
        function findApplicantDataForMap(jid){
            console.log("ApplicationService:Client findApplicantDataForMap jid" + jid );
            var url = "/api/application/map/" + jid;
            return $http.get(url);
        }
        // function findApplicantDataForMap(jid){
        //     console.log("JobService findApplicantDataForMap jid=" + jid);
        //     var applicantData = [];
        //     var skillsData = [];
        //     // var job = findJobByJId(jid);
        //     var currentApplication = findApplicationById(jid);
        //     var application;
        //     // console.log("applications# " + applicants.length);
        //     for(var i in currentApplication.lstApplications){
        //         application = currentApplication.lstApplications[i];
        //         var userState = application.state;
        //         var userDegree = application.degree;
        //         // console.log('userstate ' , userState);
        //         var flag = false;
        //         var flag2 = false;
        //         for(var j in applicantData) {
        //             if (applicantData[j].State == userState && applicantData[j].label == userDegree) {
        //                 applicantData[j].value = applicantData[j].value + 1;
        //                 flag = true;
        //                 break;
        //             }
        //
        //         }
        //         if(!flag)
        //             applicantData.push({State: userState, label: userDegree, value: 1});
        //
        //         var userSkills = application.skills;
        //         // console.log(userSkills);
        //         for(var z in userSkills){
        //             flag2 = false;
        //             for(var zi in skillsData){
        //                 if (skillsData[zi].State == userState &&
        //                     skillsData[zi].label == userSkills[z]) {
        //
        //                     skillsData[zi].value = skillsData[zi].value + 1;
        //                     flag2 = true;
        //                     // console.log("adding skill " + userSkills[z]);
        //                     break;
        //                 }
        //             }
        //             if(!flag2){
        //                 // console.log("adding skill " + userSkills[z]);
        //                 skillsData.push({State: userState, label: userSkills[z]
        //                     , value: 1});
        //             }
        //         }
        //
        //     }
        //     // console.log("JobService applicantDataFromFun " + applicantData.length);
        //     // console.log(applicantData);
        //     // console.log("JobService applicantDataFromFun skillsData# " + skillsData.length);
        //     // console.log(skillsData);
        //     return {applicantData: applicantData, skillsData: skillsData};
        // }



    }
})();