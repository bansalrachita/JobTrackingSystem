module.exports = function (app, models) {
    var userModel = models.userModel;
    // var user_unique_id = 99999;


    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));

    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(session({ secret: process.env.LINKEDIN_SECRET, name: 'id', cookie: { secure: true } }))

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    // var LinkedinStrategy = require('passport-linkedin').Strategy;
    var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

    var multer = require('multer');
    var upload = multer({dest: __dirname + '/../../public/uploads'});


    app.get("/api/user/:uid", findUserById);
    app.get("/api/user", getUsers);
    app.get("/api/user/role/:uid", findUserRoleById);
    app.get('/api/loggedin', loggedin);

    app.put("/api/user/:uid", updateUser);
    app.put("/api/user/:currentUserId/follows/:userId", followUser);

    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.post('/api/logout', logout);
    app.post('/api/user', createUser);
    app.post("/api/login", passport.authenticate('local'), login);
    // app.post('/api/register', register);

    app.delete("/api/user/:uid", deleteUser);
    app.delete("/api/user/:currentUserId/unfollows/:userId", unFollowUser);

    app.put("/api/user/:currentUserId/savejob/:jobId", saveJob);
    app.delete("/api/user/:currentUserId/unsavejob/:jobId", unsaveJob);

    // app.get('/auth/linkedin', passport.authenticate('linkedin', { scope : 'email' }));
    app.get('/auth/linkedin', passport.authenticate('linkedin'));


    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', {
            successRedirect: '/project/#/dashboard',
            failureRedirect: '/project/#/login'
        }));

    var linkedinConfig = {
        clientID     : process.env.LINKEDIN_KEY,
        clientSecret : process.env.LINKEDIN_SECRET,
        callbackURL  : process.env.LINKEDIN_CALLBACK_URL,
        // consumerKey : process.env.LINKEDIN_KEY,
        // consumerSecret : process.env.LINKEDIN_SECRET,
        // callbackURL : process.env.LINKEDIN_CALLBACK_URL,
        scope: ['r_emailaddress', 'r_basicprofile'],
        // passReqToCallback: true,
        state: true
    };

    passport.use(new LinkedinStrategy(linkedinConfig, linkedinStrategy));

    function linkedinStrategy(token, refreshToken, profile, done) {
        console.log("linkedinStrategy token findingLinkedUser profile=", profile);
        var id = profile.id;
        
        userModel
            .findLinkedinUser(id)
            .then(function(user) {
                console.log("LinkedinStrategy success findLinkedinUser", user);
                if (user) {
                    console.log('going for callback done');
                    return done(null, user);
                } else {
                    var newUser = {
                        username: profile.displayName.replace(/ /g, ""),
                        linkedin: {
                            id: profile.id,
                            displayName: profile.displayName
                        },
                        city: profile._json.location.name,
                        email: profile._json.emailAddress,
                        following: [],
                        followers: [],
                        firstName: profile._json.firstName,
                        lastName: profile._json.lastName,
                        img: profile._json.pictureUrl,
                        summary: profile._json.summary,
                        about: profile._json.headline,
                        role: "user"
                    };
                    console.log("LinkedinStrategy createUser");
                    return userModel.createUser(newUser);
                }
            }, function (err){
                console.log("LinkedinStrategy error", err);
            }).then(function(user) {
                console.log("LinkedinStrategy done callback");
                return done(null, user);
            }
        );
        console.log(profile);
    }


    function localStrategy(username, password, done) {
        console.log("UserService:server localStrategy ", username, password);

        userModel
        // .findUserByCredentials(username, password)
            .findUserByUsername(username)
            .then(function(user) {
                console.log("UserService:server localStrategy found userby credentials ", user);
                if(user && user.username === username &&
                    password == user.password) {
                    // bcrypt.compareSync(password, user.password)) {
                    console.log("UserService:server localStrategy username and password correct");
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            },function(err) {
                if (err) { return done(err); }
            });
    }

    function loggedin(req, res) {
        console.log("UserService:Server loggedin res ", req.user);
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function serializeUser(user, done) {
        console.log("serializeUser ", user );
        done(null, user);
    }

    function deserializeUser(user, done) {
        console.log("deserializeUser ", user );

        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }


    function login(req, res){
        console.log("UserService:Server login");
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        console.log('logout');
        req.logout();
        res.send(200);
    }


    function saveJob(req, res){
        var currentUserId = req.params.currentUserId;
        var jobId = req.params.jobId;

        userModel
            .saveJob(currentUserId, jobId)
            .then(function (response) {
                console.log("UserService:Server saveJob User");
                res.send(200);
            }, function (error) {
                res.status(400).send("Error in adding", error.statusText);
            });
    }

    function unsaveJob(req, res){
        var currentUserId = req.params.currentUserId;
        var jobId = req.params.jobId;

        userModel
            .unsaveJob(currentUserId, jobId)
            .then(function (response) {
                console.log("UserService:Server unsaveJob User");
                res.send(200);
            }, function (error) {
                res.status(400).send("Error in removing " +
                    "from follower list", error.statusText);
            });
    }

    function followUser(req, res){
        var currentUserId = req.params.currentUserId;
        var otherUserId = req.params.userId;
        
        userModel
            .followers(otherUserId, currentUserId)
            .then(function (response) {

                return userModel
                    .following(otherUserId, currentUserId);
            }, function (error) {
                res.status(400).send("Error in adding", error.statusText);
            })
            .then(function (response) {
                res.json(200);
            }, function (error) {
                res.status(400).send("Error in adding", error.statusText);
            });
    }

    function unFollowUser(req, res){
        var currentUserId = req.params.currentUserId;
        var otherUserId = req.params.userId;
        
        userModel
            .removeFromFollowers(otherUserId, currentUserId)
            .then(function (response) {
                return userModel
                    .removeFromFollowing(otherUserId, currentUserId);
            }, function (error) {
                res.status(400).send("Error in removing " +
                    "from follower list", error.statusText);
            })
            .then(function (response) {
                res.json(200);
            }, function (error) {
                res.status(400).send("Error in removing " +
                    "from following list", error.statusText);
            });
    }

    function createUser(req, res) {
        var newUser = req.body;
        console.log("UserService:Server createUser User ", newUser);
        var checkUsername = newUser.username;

        userModel
            .findUserByUsername(checkUsername)
            .then(function (response){
                console.log("UserService:Server findUserByUsername success ", response);
                if(response == null){
                    return true;
                }else{
                    return false;
                }
            }, function (err){
                console.log("UserService:Server findUserByUsername err");
                res.status(400).send(err);
            }).then(function (flag){
                if(flag){
                    userModel
                        .createUser(newUser)
                        .then(function (user) {
                            if (user) {
                                req.login(user, function (err) {
                                    if (err) {
                                        res.status(400).send(err);
                                    } else {
                                        res.json(user);
                                    }
                                });
                            }
                        });
                }else{
                    console.log("UserService:Server username exists!");
                    res.status(400).send("UserName exists!");
                }

        });



    }

    function updateUser(req, res) {
        var id = req.params.uid;
        var newUser = req.body;
        // newUser.delete(_id);
        console.log("UserService:Server updateUser by userId=" + id);
        
        userModel
            .updateUser(id, newUser)
            .then(function(stats) {
                console.log(stats);
                res.send(200);
            }, function(error) {
                res.statusCode(404).send(error);
            });

    }

    function findUserById(req, res) {
        var id = req.params.uid;
        console.log("UserService:Server findUserById id=", id);
        
        userModel
            .findUserById(id)
            .then(function (user){
                res.send(user);
            }, function (error){
                res.statusCode(404).send(error);
            });
    }

    function findUserRoleById(req, res) {
        var userId = req.params.uid;
        console.log("finding user by id=", userId);
        console.log("Users ", users);
        

        userModel
            .findUserById(userId)
            .then(function (user){
                console.log("UserService:Server findUserById ", user);
                res.send(user.role);
            }, function (err){
            console.log("UserService:Server findUserById err");
            res.send({});
        });
    }

    function uploadImage(req, res) {
        console.log("UserService:Server uploadImage");
        if (req.file) {

            var myFile = req.file;
            var originalname = myFile.originalname; // file name on user's computer
            var filename = myFile.filename; // new file name in upload folder
            var path = myFile.path; // full path of uploaded file
            var destination = myFile.destination; // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;

            var userId = req.body.userId;
            console.log("UserService:Server uploadImage for uid=" + userId + " @ " + path);
            
            userModel
                .findUserById(userId)
                .then(function (user){
                    console.log("UserService:Server findUserById success");
                    return user;
                }, function (err){
                    console.log("UserService:Server findUserById error");
                    res.statusCode(404).send(err);
                }).then(function (user){
                console.log("UserService:Server updating user ", user._id);
                user.img = "/uploads/" + filename;
                userModel
                    .updateUser(user._id, user)
                    .then(function (stats){
                        console.log("UserService:Server updated");
                        res.send(200);
                    }, function (err){
                        console.log("UserService:Server update error");
                        res.statusCode(404).send(error);
                    })
            });

            res.redirect("/project/#/dashboard/" + userId + "/profile");
        } else {
            console.log("empty file!");
        }
    }

    function getUsers(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        var role = req.query['role'];
        console.log("UserService:Server getUsers for username=" + username
            + " password " + password + " role " + role);

        if (role) {
            findUserByRole(role, res);
        }
        else if (username && password) {
            findUserByCredentials(username, password, res);
        } 
        else if (username) {
            findUserByUsername(username, res);
        } else {
            findAll(res);
        }
    }

    function findAll(res) {
        console.log("UserService:Server findAll ");

        userModel.findAll()
            .then(function (users){
                res.json(users);
            }, function (err){
                res.statusCode(404).send(err);
            });
    }

    function findUserByRole(role, res) {
        console.log("UserService:Server findUserByRole role=", role);
        
        userModel
            .findUserByRole(role)
            .then(function (users){
                res.json(users);
            }, function (err){
                res.statusCode(404).send(err);
            });
    }

    function findUserByCredentials(username, password, res) {
        console.log("UserService:Server findUserByCredentials for username=" + username
            + " password " + password);
        
        userModel.findUserByCredentials(username, password)
            .then(function (user){
                res.json(user);
            }, function (err){
                res.statusCode(404).send(err);
            });
    }


    function findUserByUsername(username, res) {
        console.log("UserService:Server findUserByUsername for username=" + username);
        
        userModel.findUserByUsername(username)
            .then(function (user){
                console.log("UserService:Server findUseByUserName success!");
                res.json(user);
            }, function (error){
                console.log("UserService:Server findUserByUserName error");
                res.statusCode(404).send(error);
            });

    }

    function deleteUser(req, res){
        var userId = req.params.uid;
        console.log("finding user by id=", userId);
        UserModel
            .deleteUser(userId)
            .then(function (response){
                console.log("user delete success");
                res.send(200);
            }, function (err){
                console.log("user delete err");
                res.statusCode(404).send(error);
            });
    }

}