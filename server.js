var express = require('express');
require("less");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
var session      = require('express-session');
// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET }));

// require ("./test/app.js")(app);`

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var project = require("./project/app.js");
project(app);

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// require ("./test/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// var assignment = require("./assignment/app.js");
// assignment(app);

var project = require("./project/app.js");
project(app);
app.use('/route', express.static(__dirname + '/node_modules/angular-ui-router/release/'));
app.use('/less', express.static(__dirname + '/node_modules/less/dist/'));

app.listen(port, ipaddress);
