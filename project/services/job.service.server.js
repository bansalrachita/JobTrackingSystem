module.exports = function (app) {
    var unique_lst_jobid = 9999;
    var lstJobs = [
        { jid : 123, state: "MA", city : "Boston", title : "Software Engineering" ,
            dept: "Engineering", location :"MA" , desc: "sample description for SE",
            skills : ["C++", "Java", "Python"],
            cid : 999, cname: "Sample Company Ltd."
        },

        { jid : 234, state: "TX", city : "Dallas", title : "QA Engineering" ,
            dept: "QA", location :"Dallas" , desc: "sample description for QA",
            skills : ["EasyMock", "JUnit", "Mockrunner"],
            cid : 999, cname: "Sample Company Ltd."
        },

        { jid : 345, state: "CA", city : "California", title : "Intern" ,
            dept: "Intern", location :"Bay Area" , desc: "Front End job for Intern",
            skills : ["Mongo", "Node", "Angular"],
            cid : 999, cname: "Sample Company Ltd."
        },

        { jid : 456, state: "CA", city : "California", title : "Intern" ,
            dept: "Intern", location :"Bay Area" , desc: "Front End job for Intern",
            skills : ["Mongo", "Node", "Angular"],
            cid : 111, cname: "Sample Company2 Ltd."
        }
    ];

    app.get("/api/job", getJobs);
    // app.get("/api/job/:cid", getJobs);
    app.post('/api/job', addJob);
    app.put("/api/job/:jid", updateJob);
    app.delete("/api/job/:jid", deleteJob);

    function deleteJob(req, res){
        var jid =  req.params.jid;
        console.log("JobService:Server deleteJob " + jid);
        for(var i in lstJobs){
            if(lstJobs[i]._id == jid){
                lstJobs.splice(i, 1);
                res.send(200);
                return;
            }
        }
        res.send(404);
    }

    function updateJob(req, res){
        var jid =  req.params.jid;
        var newJob = req.body;
        console.log("JobService:Server updateJob " + jid);
        console.log("newjob ", newJob);
        for(var i in lstJobs) {
            if(lstJobs[i].jid == jid) {
                lstJobs[i] = newJob;
                res.send(200);
                return;
            }
        }
        res.send(400);
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
            res.send(lstJobs);
        }
    }

    function findJobByJId(jid, res){
        console.log("JobService:Server findJobByJId " + jid);
        for(var i in lstJobs) {
            if(lstJobs[i].jid == jid) {
                res.send(lstJobs[i]);
                return;
            }
        }
        res.send({});
    }

    function findJobByCId(cid, res){
        var lst = [];

        console.log("JobService:Server findJobByCId " + cid);
        for(var i in lstJobs) {
            if(lstJobs[i].cid == cid) {
                lst.push(lstJobs[i]);
            }
        }
        res.send(lst);
    }

    function addJob(req, res){
        var newJob = req.body;
        var id = -1;
        unique_lst_jobid += 1;
        id = unique_lst_jobid.toString();
        var cid = newJob.cid;
        console.log("UserService:Server addJob jid, " + id + " for cid=" + cid);
        newJob._id = id;
        newJob.jid = id;
        lstJobs.push(newJob);
        res.send(newJob);

    }

}