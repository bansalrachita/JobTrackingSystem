module.exports = function() {
    var mongoose = require("mongoose");
    textSearch = require('mongoose-text-search');

    var JobSchema = mongoose.Schema({
        state:  {type: String, default: ""},
        city: String,
        title: String,
        dept: String,
        location: String,
        desc: String,
        skills: {type: Array, default: []},
        cid: {type: mongoose.Schema.ObjectId, ref: "User"},
        cname: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.job"});



    // make schema index here
    // give schema text search capabilities
    JobSchema.plugin(textSearch);
// add a text index
    JobSchema.index(
        {
            title: "text",
            desc: "text",
            skills: "text",
            state: "text",
            city: "text"
        },
        {
            weights: {
                title: 2,
                desc: 1,
                skills: 2,
                state: 1,
                city: 1
            },
            name: "JobIndex"
        }
    );

    return JobSchema;
};