module.exports = function (app) {
    var unique_applications_id = 9999;
    var applications = [
        {
            _id: 111,
            jobId: 123,
            cid: 999,
            foreignUserId: [301, 302, 304, 305, 306, 307],
            lstApplications: [
                {
                    userId: 301, username: "bob",
                    "name": "bob",
                    "degree": "Masters of Science",
                    "university": "Boston University",
                    "state": "Massachusetts",
                    skills: ["Hadoop", "Java", "hdfs", "Networking"],
                    "city": "Boston"
                },
                {
                    userId: 302, username: "alice",
                    name: "alice",
                    university: "Northeastern University",
                    state: "Massachusetts",
                    city: "Boston",
                    skills: ["Java", "Python"],
                    degree: "Masters of Science"
                },
                {
                    userId: 304, username: "ram",
                    "name": "Ram",
                    "degree": "Masters of Science",
                    "university": "Boston University",
                    skills: ["Java", "Python"],
                    "state": "Massachusetts",
                    "city": "Boston"
                },
                {
                    userId: 305,
                    "name": "Casey",
                    "university": "Harvard University",
                    "state": "Massachusetts",
                    "city": "Cambridge",
                    skills: ["Java", "Python"],
                    "degree": "Masters of Science"
                },
                {
                    userId: 306,
                    "name": "Shang",
                    "degree": "Masters of Science",
                    "university": "University of Wisconsin Madison",
                    "state": "Wisconsin",
                    skills: ["Java", "Python"],
                    "city": "Madison"
                },
                {
                    userId: 307,
                    "name": "Jun yan",
                    "degree": "Master of science",
                    skills: ["Java", "Python", "Ruby"],
                    "university": "University of Wisconsin Madison",
                    "state": "Wisconsin",
                    "city": "Madison"
                }
            ]
        },
        {
            _id: 112, jobId: 234, cid: 999,
            lstApplications: [
                {
                    userId: 303, username: "bob",
                    name: "bob",
                    university: "Northeastern University",
                    state: "Massachusetts",
                    city: "Boston",
                    degree: "Dual Major, Economics and English",
                    skills: ["Management", "Litrature"],
                }
            ],
            foreignUserId: [303]
        },
        {
            _id: 113, jobId: 345, cid: 999, lstApplications: [], foreignUserId: []
        },
        {
            _id: 114, jobId: 456, cid: 111, lstApplications: [], foreignUserId: []
        }
    ];

    // app.get("/api/application/:appid", getApplicationById);
    app.get("/api/application", getApplications);
    app.post('/api/application', addApplication);
    app.get("/api/application/degree/:jid", aggregateDegreesForJID);
    app.get("/api/application/skills/:jid", aggregateSkillsForJID);
    app.get("/api/application/map/:jid", findApplicantDataForMap);
    app.get("/api/application/tree/:jid", getApplicantsDyn);
    app.get("/api/application/applicants/:jid", getApplicants);

    function findApplicantDataForMap(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server findApplicantDataForMap jid=" + jid);
        var applicantData = [];
        var skillsData = [];
        var currentApplication;

        for (var i in applications) {
            if (applications[i].jobId == jid) {
                currentApplication = applications[i];
                break;
            }
        }

        var application;
        // console.log("applications# " + currentApplication.length);
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
        // console.log("JobService applicantDataFromFun " + applicantData.length);
        // console.log(applicantData);
        // console.log("JobService applicantDataFromFun skillsData# " + skillsData.length);
        // console.log(skillsData);
        console.log("ApplicationService:Server findApplicantDataForMap");
        res.send({applicantData: applicantData, skillsData: skillsData});
    }

    function aggregateSkillsForJID(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server aggregateSkillsForJID " + jid);
        var currentApplication;

        for (var i in applications) {
            if (applications[i].jobId == jid) {
                currentApplication = applications[i];
                break;
            }
        }


        var aggData = [];
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
        console.log("ApplicationService:Server aggregateSkillsForJID");
        console.log(aggData);
        res.send(aggData);
    }

    function aggregateDegreesForJID(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server aggregateDegreesForJID " + jid);
        var currentApplication;

        for (var i in applications) {
            if (applications[i].jobId == jid) {
                currentApplication = applications[i];
                break;
            }
        }

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
        for (var i in applications) {
            if (applications[i].jobId == jid && applications[i].foreignUserId) {
                console.log(applications[i].foreignUserId);
                // return applications[i].foreignUserId.includes(parseInt(uid));
                res.send(applications[i]);
                return;
                // applications[i].lstApplications.push(applicationDetails);
            }
        }
        // return false;
        res.send({});
    }


    function findApplicationById(aid, res) {
        console.log("ApplicationService:Server findApplicationById id=", aid);
        for (var i in applications) {
            if (applications[i]._id == aid) {
                res.send(applications[i]);
                return;
            }
        }
        res.send({});
    }

    // function findJobByJId(jid, res){
    //     console.log("JobService:Server findJobByJId " + jid);
    //     for(var i in jobs) {
    //         if(jobs[i].jid == jid) {
    //             res.send(jobs[i]);
    //             return;
    //         }
    //     }
    //     res.send({});
    // }
    //
    // function findJobByCId(cid, res){
    //     var lst = [];
    //
    //     console.log("JobService:Server findJobByCId " + cid);
    //     for(var i in jobs) {
    //         if(jobs[i].cid == cid) {
    //             lst.append(jobs[i]);
    //         }
    //     }
    //     res.send(lst);
    // }
    //
    function addApplication(req, res) {

        // var cid = req.query['cid'];
        var jid = req.query['jid'];
        var uid = req.query['uid'];
        console.log("ApplicationService:Server addApplication " + " "
            + jid + " for uid=" + uid);

        var newApplication = req.body;

        for (var i in applications) {
            if (/*applications[i].cid == cid && */applications[i].jobId == jid) {
                applications[i].lstApplications.push(newApplication);
                applications[i].foreignUserId.push(parseInt(uid));
                res.sendStatus(200);
                return;
            }
        }

        res.send(400);
    }

    // function getApplicantTree(req, res) {
    //     var jid = req.params.jid;
    //     console.log("ApplicationService:Server getApplicantTree jid=" + jid);
    //     res.send(tree);
    // }

    function getApplicants(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server getApplicants jid=" + jid);
        for (var i in applications) {
            if (applications[i].jobId == jid) {
                res.send(applications[i].lstApplications);
                return;
            }
        }
        res.send(400);
    }

    function getApplicantsDyn(req, res) {
        var jid = req.params.jid;
        console.log("ApplicationService:Server getApplicantsDyn jid=" + jid);

        var currentApplicationByJID;
        var ans = {name: "JID " + jid, children: []};
        var inside = {};

        for (var i in applications) {
            if (applications[i].jobId == jid) {
                currentApplicationByJID = applications[i].lstApplications;
                break;
            }
        }

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
                            // realApplicants.push(angular.copy(ereal));
                            // realApplicants.push(ereal);
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
    }


}