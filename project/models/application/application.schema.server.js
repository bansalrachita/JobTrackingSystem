module.exports = function() {
    var mongoose = require("mongoose");

    var ApplicationSchema = mongoose.Schema({
        jobId: {type: mongoose.Schema.ObjectId, ref: "Job"},
        cid: {type: mongoose.Schema.ObjectId, ref: "User"},
        foreignUserId: {type: [String], default: []},
        lstApplications: { type: {
            userId: String,
            username: String,
            name: String,
            degree: String,
            university: String,
            state: String,
            Skills: {type: [String], default : []},
            city: String
        }, default: []},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.application"});

    return ApplicationSchema;
};