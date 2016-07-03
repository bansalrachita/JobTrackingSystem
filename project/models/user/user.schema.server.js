module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        role: String,
        about: String,
        firstName: String,
        lastName: String,
        email: String,
        experience: String,
        degree: String,
        skills: {type: Array, default: []},
        state:  {type: String, default: ""},
        github: String,
        img: String,
        phone: String,
        city: String,
        summary: String,
        workEx: {type: Array, default: []},
        education: {type: Array, default: []},
        // check workEx and education
        dateCreated: {type: Date, default: Date.now},
        following: {type: [String], default: []},
        followers: {type: [String], default: []},
        savedjobs: {type: [String], default: []},
        linkedin: {
            id:    String,
            token: String
        },
        gpa: String,
        cname: String,
        location: String,
        spl: String
    }, {collection: "project.user"});

    return UserSchema;
};