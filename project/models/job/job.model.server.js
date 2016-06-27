module.exports = function() {

    var mongoose = require("mongoose");
    var JobSchema = require("./job.schema.server.js")();
    var Job = mongoose.model("Job", JobSchema);
    var pagesize = 20;
    var api = {
        createJob: createJob,
        getAllJobs: getAllJobs,
        findJobById: findJobById,
        findJobByCId: findJobByCId,
        updateJob: updateJob,
        deleteJob: deleteJob,
        textSearch: textSearch,
        getJobByPageNumber: getJobByPageNumber,
        getJobByPageNumberWithCID: getJobByPageNumberWithCID
    };
    return api;

    function getJobByPageNumberWithCID(cid, pagenumber){
        return Job
            .find({cid: cid})
            .sort({dateCreated: -1})
            .skip(pagesize*(pagenumber-1))
            .limit(pagesize)
    }

    function getJobByPageNumber(pagenumber){
        return Job
                .find()
                .sort({dateCreated: -1})
                .skip(pagesize*(pagenumber-1))
                .limit(pagesize)
    }

    function textSearch(query){
        var option = {
            // list of schema property you do not want to include
            project: '-dept -location'
            // casts queries based on schema
            // , filter: { likes: { $gt: 1000000 }}
            , limit: 10
            , language: 'english'
            , lean: true
        };
        console.log("JobModel:Server textSeach ", query);
        return Job.find(
            { $text : { $search : query } }
            ,{ score : { $meta: "textScore" } }
            )
            // .sort({ score : { $meta : 'textScore' } })
            .exec(function(err, results) {
                // callback
                return results;
            });
    }

    function createJob(cid, job) {
        job.cid = cid;
        return Job.create(job);
    }

    function getAllJobs(){
        return Job.find();
    }

    function findJobById(jobId) {
        return Job.findById(jobId);
    }

    function findJobByCId(cid){
        return Job.find({cid: cid});
    }

    function updateJob(jobId, job) {
        delete job._id;
        console.log("JobModel:server updateJob ", job);
        return Job
            .update({_id: jobId},{
                $set: {
                    state: job.state,
                    city: job.city,
                    title: job.title,
                    dept: job.dept,
                    location: job.location,
                    desc: job.desc,
                    skills: job.skills
                }
            });
    }

    function deleteJob(jobId){
        return Job.remove({_id: jobId});
    }
};