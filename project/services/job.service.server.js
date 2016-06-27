module.exports = function (app, models) {
    var jobModel = models.jobModel;
    
    app.get("/api/job", getJobs);

    app.put("/api/job/:jid", updateJob);

    app.post('/api/job', createJob);

    app.delete("/api/job/:jid", deleteJob);

    app.get("/api/job/textsearch", getRelevantJobs);

    app.get("/api/job/pagenumber/", getJobByPageNumber);

    function getJobByPageNumber(req, res){
        console.log("JobService:Server getRelevantJobs");
        var pagenumber = req.query['pnu'];
        var cid = req.query['cid'];
        console.log("page# " + pagenumber + " cid" + cid);

        if(cid){
            jobModel
                .getJobByPageNumberWithCID(cid, pagenumber)
                .then(function (results){
                    console.log("JobService:Server getJobByPageNumber success");
                    res.json(results);
                }, function (err){
                    console.log("JobService:Server getJobByPageNumber err");
                    res.statusCode(404).send(error);
                });
        }else{
            jobModel
                .getJobByPageNumber(pagenumber)
                .then(function (results){
                    console.log("JobService:Server getJobByPageNumber success");
                    res.json(results);
                }, function (err){
                    console.log("JobService:Server getJobByPageNumber err");
                    res.statusCode(404).send(error);
                });
        }




    }


    function getRelevantJobs(req, res){
        console.log("JobService:Server getRelevantJobs");
        // var query =  req.params.query;

        var query = req.query['query'];
        console.log("JobService:Server getRelevantJobs " + query);
        var spaceQuery = query.split('+').join(' ');

        jobModel
            .textSearch(spaceQuery)
            .then(function (data){
                console.log("job textSearch success");
                res.json(data);
            }, function (err){
                console.log("job textSearch err");
                res.statusCode(404).send(error);
            });
    }

    function deleteJob(req, res){
        var jid =  req.params.jid;
        console.log("JobService:Server deleteJob " + jid);
        
        jobModel
            .deleteJob(jid)
            .then(function (response){
                console.log("job delete success");
                res.send(200);
            }, function (err){
                console.log("job delete err");
                res.statusCode(404).send(error);
            });
    }

    function updateJob(req, res){
        var jid =  req.params.jid;
        var newJob = req.body;
        console.log("JobService:Server updateJob " + jid);
        
        jobModel
            .updateJob(jid, newJob)
            .then(function(stats) {
                console.log(stats);
                res.send(200);
            }, function(error) {
                res.statusCode(404).send(error);
            });
    }

    function getJobs(req, res) {
        var cid = req.query['cid'];
        var jid = req.query['jid'];
        console.log("JobService:Server inside getJobs " + cid + " " + jid);

        if(jid) {
            findJobByJId(jid, res);
        } else if(cid) {
            findJobByCId(cid, res);
        } else {
            findAllJobs(res);
        }
    }

    function findAllJobs(res){
        console.log("JobService:Server findAllJob");
        jobModel
            .getAllJobs()
            .then(function (jobs){
                console.log("JobService:Server findAllJob success");
                res.json(jobs);
            }, function(err){
                console.log("JobService:Server findAllJob err");
                res.statusCode(404).send(err);
            });
    }

    function findJobByJId(jid, res){
        console.log("JobService:Server findJobByJId " + jid);
        
        jobModel
            .findJobById(jid)
            .then(function (job){
                console.log("JobService:Server findJobById success" + job);
                res.json(job);
            }, function (err){
                console.log("JobService:Server findJobById err");
                res.statusCode(404).send(err);
            });
    }

    function findJobByCId(cid, res){
        console.log("JobService:Server findJobByCId " + cid);
        
        jobModel
            .findJobByCId(cid)
            .then(function (job){
                console.log("JobService:Server findJobById success" + job);
                res.json(job);
            }, function (err){
                console.log("JobService:Server findJobById err");
                res.statusCode(404).send(err);
            });
    }

    function createJob(req, res){
        var newJob = req.body;
        
        console.log("UserService:Server addJob job", newJob);
        
        jobModel
            .createJob(newJob.cid, newJob)
            .then(function (job){
                console.log("JobService:Server createJob success ", job);
                if(job){
                    res.json(job);
                }else{
                    res.status(400);
                }
            }, function (err){
                console.log("JobService:Server createJob err ");
                res.status(400).send(err);
            });
    }

}