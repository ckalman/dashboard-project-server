var db = require('node-localdb');
var User = require('./User');
var project = db(__dirname + '/../database/Project.json');
var _ = require('lodash');

class Project {

    constructor(data) {
        this.id = data._id || data.id || null;
        this.title = data.title || null;
        this.description = data.description || null;
        this.deadline = data.deadline || null;
        this.status = data.status || null;
        this.tags = data.tags || [];
        this.nbWorker = data.nbWorker || 0;
        // Type : User
        this.projectManager = new User(data.projectManager) || null;

    }


    static all() {
        return new Promise(function (resolve, reject) {
            project.find({}).then(function (projects) {
                var temp = [];
                projects.forEach((proj) => {
                    temp.push(new Project(proj));
                })
                resolve(temp);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Find with exactly same value.
     * Example: find({admin: true}) // an array of admin user
     */
    static find(search) {
        return new Promise(function (resolve, reject) {
            project.find(search).then(function (projects) {
                var temp = [];
                projects.forEach((proj) => {
                    temp.push(new Project(proj));
                })
                resolve(temp);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static findByTag(tag) {
        return new Promise(function (resolve, reject) {
            project.find({}).then(function (projects) {
                var temp = [];
                projects.forEach((proj) => {
                    proj.tags.forEach((t) => {
                        if (t == tag) {
                            temp.push(proj);
                        }
                    });
                });
                resolve(temp);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static likeString(key, value) {
        return new Promise(function (resolve, reject) {
            project.find({}).then(function (projects) {
                var temp = [];
                projects.forEach((proj) => {
                    if (_.includes(proj[key], value)) {
                        temp.push(new Project(proj));
                    }
                })
                resolve(temp);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static findById(id) {
        return new Promise(function (resolve, reject) {
            project.findOne({ _id: id }).then(function (u) {
                var instance = new Project(u);
                resolve(instance);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static search(search) {
        return new Promise(function (resolve, reject) {
            project.find({}).then(function (projects) {
                var temp = [];
                projects.forEach((project) => {
                    let finded = false;
                    Object.keys(project).forEach((key) => {
                        let evaluate = project[key];
                        if (_.isObject(evaluate)) {

                        } else if (_.isArray(evaluate)) {

                        } else {
                            if (_.includes(evaluate, search)) {
                                finded = true;
                                console.log("finded : ", search);
                            }
                        }


                    });
                    if (finded) {
                        temp.push(project);
                    }
                });
                resolve(temp);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    save() {
        var self = this;
        return new Promise(function (resolve, reject) {
            project.remove({ id: self.id }).then(function (u) {
                project.insert(self).then(function (u) {
                    resolve(new Project(u));
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }

    static remove(id) {
        return new Promise(function (resolve, reject) {
            project.remove({ _id: id }).then(function (u) {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static removeAll() {
        return new Promise(function (resolve, reject) {
            project.remove().then(function (u) {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = Project;