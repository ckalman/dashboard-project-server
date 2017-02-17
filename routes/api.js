const express = require("express");
const bodyParser = require("body-parser");
const assert = require('assert');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('../config');

let User = require('../models/User');
let Project = require('../models/Project');

const AUTH = 'x-access-token';

const app = express();

app.set('secret', config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var apiRoutes = express.Router();

// Authenticate route

app.get('/test', (req, res) => {
    console.log("test");
    Project.search("test");
    res.json("fdsfdsfsd");
});

app.post("/auth", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    User.findByUserName(username).then((user) => {
        console.log("test user ", user);
        if (user && user.checkPassword(password)) {
            delete user.password;
            var token = jwt.sign(user, app.get('secret'), {
                expiresIn: 144000
            });
            res.json(token);
        } else {
            res.status(401).json("User name or password invalid");
        }
    }).catch((err) => {
        res.status(401).json("User name or password invalid");
        console.error("error : ", err);
        res.json(err);
    });
});


// Insecure routes

app.get("/project/all", (req, res) => {
    Project.all().then((projects) => {
        res.json(projects);
    }).catch((err) => {
        console.log(err)
    });
});

// Titre, description, tags
// TODO
app.get("/project/search", (req, res) => {
    var search = req.query.search;
    Project.search(search).then((projects) => {
        res.json(projects);
    }).catch(err => {
        console.error(err);
        res.status(500).json("/project/filtered : RIP show log");
    });
});

app.get("/project/filtered", (req, res) => {
    var type = req.query.filterType;
    var value = req.query.value;
    Project.find({ [type]: value }).then((projects) => {
        res.json(projects);
    }).catch(err => {
        console.error(err);
        res.status(500).json("/project/filtered : RIP show log");
    });
});

app.get("/project/:id", (req, res) => {
    let id = req.params.id;
    Project.findById(id).then((project) => {
        res.json(project);
    }).catch(err => res.status(403).json("Project id not found"));
});

app.get('/role', (req, res) => {
    res.json(["Administrator", "Project Manager"]);
});


// AUTH MIDDLEWARE

// route middleware to check the token
apiRoutes.use(function (req, res, next) {
    var token = req.headers[AUTH];
    if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                // console.log(err);
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                console.log("decoded", decoded);
                req.user = decoded;
                next();
            }
        });
    }
    // Code to accept no token authentication
    else {
        req.user = null;
        next();
    }
    /*
        Code to return an error if there is no token provided instead of just ignoring it
     */
    // else {
    //     return res.status(403).send({
    //         success: false,
    //         message: 'No token provided.'
    //     });
    // }
});

// Routes that are secured by token
app.use(apiRoutes);


// Secure routes
app.post("/project", (req, res) => {

    // Optional
    var id = req.body.userId;
    var currentUser = req.user;

    var project = new Project(
        {
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
            status: req.body.status,
            nbWorker: req.body.nbWorker,
            projectManager: req.user
        });
    project.save().then((ok) => {
        res.json("ok");
    }).catch(err => {
        console.log(err);
        res.status(400).json("project not created");
    });
});


app.put("/project", (req, res) => {
    let id = req.body.id;
    Project.findById(id).then((project) => {
        project.projectManager = req.user;
        project.title = req.body.title;
        project.description = req.body.description;
        project.deadline = req.body.deadline;
        project.status = req.body.status;
        project.tags = req.body.tags;
        project.nbWorker = req.body.nbWorker;
        project.save().then((ok) => {
            res.json(project);
        }).catch(err => {
            console.log(err);
            res.status(400).json("Project not found");
        });
    });
});

app.delete("/project", (req, res) => {
    let id = req.body.id;
    Project.remove(id).then((ok) => {
        res.json("ok");
    }).catch((err) => {
        console.error("rip : ", err);
        res.status(400).json("Remove error");
    });
});

// TODO change user type : req.body.userType => admin true false.
app.post("/user", (req, res) => {
    User.findByUserName(req.body.username).then((u) => {
        res.status(500).json('Le nom d\'utilisateur existe déjà');
    }).catch((no) => {
        let user = new User({ username: req.body.username, admin: req.body.userType });
        user.setPassword(req.body.password);
        res.json('Votre compte a bien été créé');
    });
});

app.delete("/projects/all", (req, res) => {
    if (req.user && req.user.admin) {
        Project.removeAll().then((remove) => {
            res.json("All user removed");
        }).catch((err) => {
            console.err("Error : ", err);
            res.status(500).json("RIP");
        })
    } else {
        res.status(403).json("admin only");
    }
});



module.exports = app;