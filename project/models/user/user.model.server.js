module.exports = function() {

    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var User = mongoose.model("User", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        findLinkedinUser: findUserByLinkedinId,
        findUserByUsername: findUserByUsername,
        findUserByRole: findUserByRole,
        findAll: findAll,
        saveJob: saveJob,
        unsaveJob: unsaveJob,
        followers: followers,
        following: following,
        removeFromFollowers: removeFromFollowers,
        removeFromFollowing: removeFromFollowing,
        deleteUser: deleteUser
    };
    return api;

    function saveJob(userId, jobId){
        console.log("UserModel:Server userId ", userId, " unsaveJob ", jobId);
        return User.update(
            {'_id': userId},
            {
                $addToSet :{'savedjobs': jobId }
            }
        );
    }

    function unsaveJob(userId, jobId){
        return User.update(
            {'_id':userId},
            {
                $pullAll: {savedjobs: [jobId]}
            }
        );
    }


    function removeFromFollowers(userId, currentUserId){
        return User.update(
            {'_id':userId},
            {
                $pullAll: {followers: [currentUserId]}
            }
        );
    }

    function removeFromFollowing(userId, currentUserId){
        return User.update(
            {'_id':currentUserId},
            {
                $pullAll: {following: [userId]}
            }
        );
    }


    function followers(userId, currentUserId){
        console.log("UserModel:Server followers userId ", userId, " currentUserId ", currentUserId);
        return User.update(
            {'_id': userId},
            {
                $addToSet :{'followers':currentUserId}
            }
        );
    }

    function following(userId, currentUserId){
        console.log("UserModel:Server following userId ", userId, " currentUserId ", currentUserId);

        return User.update(
            {'_id': currentUserId},
            {
                $addToSet :{'following':userId}
            }
        );
    }

    function findUserByLinkedinId(linkedinId) {
        console.log("UserModel:server findUserByLinkedinId ", linkedinId);
        return User.findOne({'linkedin.id': linkedinId});
    }

    function updateUser(userId, user) {
        delete user._id;
        console.log("UserModel:server updateUser ", user);
        return User
            .update({_id: userId},{
                $set: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    about: user.about,
                    email: user.email,
                    experience: user.experience,
                    degree: user.degree,
                    skills: user.skills,
                    state: user.state,
                    github: user.github,
                    img: user.img,
                    phone: user.phone,
                    city: user.city,
                    summary: user.summary,
                    workEx: user.workEx,
                    education: user.education,
                    following: user.following,
                    followers: user.followers,
                    cname: user.cname,
                    location: user.location,
                    gpa: user.gpa
                    // linkedin: user.linkedin
                }
            });
    }

    function deleteUser(userId) {
        return User.remove({_id: userId});
    }

    function findUserByUsername(username) {
        return User.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return User.findOne({username: username, password: password});
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByRole(role){
        return User.find({role: role});
    }

    function findAll(){
        return User.find();
    }

    function createUser(user) {
        console.log("user.model.server createUser");
        console.log(user);
        return User.create(user);
    }
};