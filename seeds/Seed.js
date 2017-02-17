var User = require('../models/User');
var Project = require('../models/Project');
var db = require('node-localdb');
var user = db(__dirname + '/../database/user.json');
var project = db(__dirname + '/../database/Project.json');


class Seed {
    constructor() {

    }

    clear() {
        return new Promise(function (resolve, reject) {
            user.remove().then(function (u) {
                project.remove().then(function (u) {
                    resolve(true);
                });
            });
        });
    }

    seedDb() {
        var promises = [];
        var userOne = new User({ username: "xavier",firstname: "Xavier", lastname: "CARREL", email: "x.c@cpnv.ch", role: "Project manager" });
        userOne.setPassword("1234");
        promises.push(userOne.save());

        var userTwo = new User({ username: "jerome", firstname: "Jerome", lastname: "CHEVILLAT", email: "j.c@cpnv.ch", role: "Administrator" });
        userTwo.setPassword("1234");
        promises.push(userTwo.save());

        var admin = new User({ username: "admin", firstname: "Admin", lastname: "Admin", email: "admin@cpnv.ch", role: "Project manager" });
        admin.setPassword("1234");

        Promise.all(promises).then((users) => {
            this.seedProject(users);
        });
        
    }

    seedProject(projectManagers) {
        var user1 = projectManagers[0];
        delete user1.password;
        var project1 = new Project({
            title: "Projet 1",
            description: "Premier projet pour test",
            status: 'Open',
            tags: ["javascript", "css", "html"],
            projectManager: user1,
            deadline: new Date(2017, 2, 25, 17, 30, 60)
        });
        project1.save();

        var user2 = projectManagers[1];
        delete user2.password;
        var project2 = new Project({
            title: "MAW2",
            description: "lorem ...",
            status: 'Close',
            tags: ["javascript", "css", "html"],
            projectManager: user2,
            deadline: new Date(2015, 2, 25, 17, 30, 60)
        });
        project2.save();

        var project3 = new Project({
            title: "Test",
            description: "lorem ...",
            status: 'Close',
            tags: ["javascript", "css", "html"],
            projectManager: projectManagers[1],
            deadline: new Date(2015, 2, 25, 17, 30, 60)
        });
        project3.save();
    }
}

module.exports = Seed;