module.exports = function (app, models) {
    var applicationModel = models.applicationModel;

    app.get("/api/application", getApplications);
    app.get("/api/application/tree/:jid", getApplicantsDyn);
    app.get("/api/application/applicants/:jid", getApplicants);

    app.get("/api/application/degree/:jid", aggregateDegreesForJID);
    app.get("/api/application/skills/:jid", aggregateSkillsForJID);
    app.get("/api/application/map/:jid", findApplicantDataForMap);

    app.put("/api/application", updateApplication);

    app.post('/api/application', addApplication);
    app.post("/api/:jid/application", createApplication);

    app.delete("/api/:jid/application", deleteApplication);


    function updateApplication(req, res){
        var jid =  req.params.jid;
        var newApplication = req.body;
        console.log("Application:Server updateApplication " + jid);

        applicationModel
            .updateJob(jid, newApplication)
            .then(function(stats) {
                console.log(stats);
                res.send(200);
            }, function(error) {
                res.statusCode(404).send(error);
            });
    }

    function deleteApplication(req, res){
        var jid = req.params.jid;
        console.log("ApplicationService:Server deleteApplication for Job jid=", jid);

        applicationModel
            .deleteApplication(jid)
            .then(function (stats){
                console.log("ApplicationService:Server deleteApplication success! " + stats);
                res.send(200);
            }, function (err){
                console.log("ApplicationService:Server deleteApplication error!");
                res.statusCode(404).send(error);
            });
    }

    function createApplication(req, res){
        var jid = req.params.jid;
        console.log("ApplicationService:Server createApplication for NewJob jid=", jid);
        var newApplication = req.body;

        applicationModel
            .createApplication(jid, newApplication)
            .then(function (application){
                console.log("ApplicationService:Server createJob success ", application);
                if(application){
                    res.json(application);
                }else{
                    res.status(400);
                }
            }, function (err){
                console.log("ApplicationService:Server createJob err");
                res.status(400).send(err);
            });
    }

    function findApplicantDataForMap(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server findApplicantDataForMap jid=" + jid);
        var applicantData = [];
        var skillsData = [];
        var currentApplication;

        applicationModel
            .findApplicationByJId(jid)
            .then(function (currentApplication){
                var application;
                console.log("ApplicationService:Server findApplicantDataForMap success");
                if(currentApplication.lstApplications){
                console.log("applications# " + currentApplication.lstApplications.length);
                    for (var i in currentApplication.lstApplications) {
                        application = currentApplication.lstApplications[i];
                        var userState = application.state;
                        var userDegree = application.degree;
                        // console.log('userstate ' , userState);
                        var flag = false;
                        var flag2 = false;
                        for (var j in applicantData) {
                            if (applicantData[j].State == userState && applicantData[j].label == userDegree) {
                                applicantData[j].value = applicantData[j].value + 1;
                                flag = true;
                                break;
                            }

                        }
                        if (!flag)
                            applicantData.push({State: userState, label: userDegree, value: 1});

                        var userSkills = application.skills;
                        // console.log(userSkills);
                        for (var z in userSkills) {
                            flag2 = false;
                            for (var zi in skillsData) {
                                if (skillsData[zi].State == userState &&
                                    skillsData[zi].label == userSkills[z]) {

                                    skillsData[zi].value = skillsData[zi].value + 1;
                                    flag2 = true;
                                    // console.log("adding skill " + userSkills[z]);
                                    break;
                                }
                            }
                            if (!flag2) {
                                // console.log("adding skill " + userSkills[z]);
                                skillsData.push({
                                    State: userState, label: userSkills[z]
                                    , value: 1
                                });
                            }
                        }

                    }
                    res.json({applicantData: applicantData, skillsData: skillsData});
                }else{
                    res.json({applicantData: [], skillsData: []});
                }

            }, function (err){
                console.log("ApplicationService:Server findApplicantDataForMap err");
                // res.send({applicantData: [], skillsData: []});
                console.log("ApplicationService:Server findApplicantDataForMap err ");
                res.status(400).send(err);
            });


    }

    function aggregateSkillsForJID(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server aggregateSkillsForJID " + jid);
        var currentApplication;

        applicationModel
            .findApplicationByJId(jid)
            .then(function (currentApplication) {
                var aggData = [];
                console.log("ApplicationService:Server findApplicationByJId success");
                if (currentApplication && currentApplication.lstApplications) {
                    for (var idx in currentApplication.lstApplications) {
                        var application = currentApplication.lstApplications[idx];

                        for (var kdx in application.skills) {
                            var flag = false;
                            for (var jdx in aggData) {
                                if (aggData[jdx].label == application.skills[kdx]) {
                                    aggData[jdx].value = aggData[jdx].value + 1;
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                aggData.push({label: application.skills[kdx], value: 1});
                            }
                        }
                    }

                }
                console.log("aggData ", aggData);
                res.send(aggData);

            }, function (err){
                console.log("ApplicationService:Server findApplicationByJId error");
                res.status(400).send(err);
            });

    }

    function aggregateDegreesForJID(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server aggregateDegreesForJID " + jid);
        var currentApplication;


        applicationModel
            .findApplicationByJId(jid)
            .then(function (currentApplication) {
                console.log("ApplicationService:Server findApplicationByJId success");
                var aggData = [];
                if (currentApplication && currentApplication.lstApplications) {
                    for (var idx in currentApplication.lstApplications) {
                        var application = currentApplication.lstApplications[idx];
                        var flag = false;
                        for (var jdx in aggData) {
                            if (aggData[jdx].label == application.degree) {
                                aggData[jdx].value = aggData[jdx].value + 1;
                                flag = true;
                            }
                        }
                        if (!flag) {
                            aggData.push({label: application.degree, value: 1});
                        }
                    }
                }
                console.log("ApplicationService:Server aggregateDegreesForJID");
                console.log(aggData);
                res.send(aggData);
            }, function (err){
                console.log("ApplicationService:Server aggregateDegreesForJID error");
                res.status(400).send(err);
            });
    }

    function getApplications(req, res) {
        var cid = req.query['cid'];
        var jid = req.query['jid'];
        var aid = req.query['aid'];
        var uid = req.query['uid'];
        console.log("ApplicationService:Server inside getJobs " + cid + " " + jid + " " + aid);

        if (aid) {
            console.log("ApplicationService:Server with aid=", aid);
            findApplicationById(aid, res);
        } else if (jid && uid) {
            console.log("ApplicationService:Server with jid=", jid + " uid", uid);
            findApplicationByJIDAndUID(jid, uid, res);
        }
    }

    function findApplicationByJIDAndUID(jid, uid, res) {
        console.log("ApplicationService:Server findApplicationByJIDAndUID");

        applicationModel
            .findApplicationByJId(jid)
            .then(function (application){
                console.log("ApplicationService:Server findApplicationByJIDAndUID success", application);

                res.json(application)
            }, function (err){
                console.log("ApplicationService:Server findApplicationByJIDAndUID err");
            });
    }


    function findApplicationById(aid, res) {
        console.log("ApplicationService:Server findApplicationById id=", aid);

        applicationModel
            .findApplicationById(aid)
            .then(function (application){
                console.log("ApplicationService:Server findApplicationById success ");
                res.json(application);
            }, function (err){
                console.log("ApplicationService:Server findApplicationById err ");
                res.send({});
            });
    }


    function addApplication(req, res) {

        var jid = req.query['jid'];
        var uid = req.query['uid'];
        console.log("ApplicationService:Server addApplication " + " "
            + jid + " for uid=" + uid);

        var newApplication = req.body;

        applicationModel
            .addApplication(jid, newApplication)
            .then(function (response){
               return response;
            }, function (err){
                console.log("ApplicationServer:Service addApplication err");
                res.status (400).send ("addApplication error", err.statusText);
            }).then(function (response){

              applicationModel
                .addForeignKeyInApplication(uid, jid)
              .then(function (response){
                  console.log("success in adding both application and foreignkey");
                  res.json(200);
              }, function (error){
                  res.status(400).send("error in adding ForeignKey in Application");
              })

        });
    }

    function getApplicants(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server getApplicants jid=" + jid);

        applicationModel
            .findApplicationByJId(jid)
            .then(function (application){
                console.log("ApplicationService:Server getApplicants success");
                res.json(application.lstApplications);
            }, function (err){
                console.log("ApplicationService:Server getApplicants err");
                res.send(404);
            });

    }

    function getApplicantsDyn(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server getApplicantsDyn jid=" + jid);

        var currentApplicationByJID;
        var ans = {name: "JID " + jid, children: []};

        applicationModel
            .findApplicationByJId(jid)
            .then(function (application){
                console.log("ApplicationService:Server getApplicants success");
                currentApplicationByJID = application.lstApplications;


                function group(application, grouper) {
                    var targetVariable = [];
                    var groupedAlready = [];
                    application.forEach(function (e) {
                        if (groupedAlready.indexOf(e[grouper]) == -1) {
                            // if(e[grouper] in targetVariable == false){
                            targetVariable.push({
                                "name": e[grouper],
                                "children": groupCity(application, "city", "state", e[grouper])
                            });
                            groupedAlready.push(e[grouper]);
                        }
                    });
                    return targetVariable;
                }

                function groupCity(application, grouper, groupedState, containingState) {
                    var targetVariable = [];
                    var groupedAlready = [];
                    application.forEach(function (e) {
                        if (groupedAlready.indexOf(e[grouper]) == -1 && e[groupedState] == containingState) {
                            targetVariable.push(
                                {
                                    "name": e[grouper],
                                    "children": groupUniversity(application, "university", groupedState, containingState, "city", e[grouper])
                                });
                            groupedAlready.push(e[grouper]);
                        }
                    });
                    return targetVariable;
                }

                function groupUniversity(application, grouper, groupedState, containingState, groupedCity, containingCity) {
                    var targetVariable = [];
                    var groupedAlready = [];
                    application.forEach(function (e) {
                        if (groupedAlready.indexOf(e[grouper]) == -1 && e[groupedState] == containingState && e[groupedCity] == containingCity) {
                            var realApplicants = [];
                            application.forEach(function (ereal) {
                                if (ereal[groupedState] == containingState && ereal[groupedCity] == containingCity && ereal[grouper] == e[grouper]) {

                                    realApplicants.push(
                                        {
                                            "name": ereal.name, "degree": ereal.degree,
                                            "university": ereal.university, "state": ereal.state,
                                            "skills": ereal.skills, "city": ereal.city
                                        });
                                }
                            });
                            targetVariable.push({"name": e[grouper], "children": realApplicants});
                            groupedAlready.push(e[grouper]);
                        }
                    });
                    return targetVariable;
                }

                var aggDegrees = group(currentApplicationByJID, "state");

                res.send({name: jid, children: aggDegrees});

            }, function (err){
                console.log("ApplicationService:Server getApplicants err");
                res.send(404);
            });

    }


}