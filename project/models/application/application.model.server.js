module.exports = function() {

    var mongoose = require("mongoose");
    var ApplicationSchema = require("./application.schema.server.js")();
    var Application = mongoose.model("Application", ApplicationSchema);

    var api = {
        createApplication: createApplication,
        addApplication: addApplication,
        addForeignKeyInApplication: addForeignKeyInApplication,
        updateApplication: updateApplication,
        findApplicationById: findApplicationById,
        findApplicationByJId: findApplicationByJId,
        findApplicationByJIDAndUID: findApplicationByJIDAndUID,
        deleteApplication: deleteApplication
    };
    return api;

    function updateApplication(jid, updatedApplication){
        return Application.update(
            {'jobId': jid}, {
                $set: {
                    cid: updatedApplication.cid,
                    lstApplications: updatedApplication.lstApplications
                }
        });
    }

    function findApplicationByJIDAndUID(jid, uid){
        return Application.findOne({jobId: jid, cid: uid});
    }

    function createApplication(jid, application) {
        return Application.create(application);
    }

    function addApplication(jid, application){
        return Application.update(
            {'jobId': jid},
            {
                $addToSet : {'lstApplications':application}
            }
        );
    }

    function addForeignKeyInApplication(uid, jid){
        return Application.update(
            {'jobId': jid},
            {
                $addToSet : {'foreignUserId': uid}
            }
        );
    }
    

    function findApplicationById(aid) {
        return Application.findById(aid);
    }

    function findApplicationByJId(jobId) {
        return Application.findOne({jobId: jobId});
    }
    
    function deleteApplication(jobId){
        return Application.remove({jobId: jobId});
    }
};