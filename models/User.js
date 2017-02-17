var db = require('node-localdb');
var user = db(__dirname + '/../database/user.json');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
var _ = require('lodash');

class User {

    constructor(data) {
        this.id = data._id || data.id || null;
        this.username = data.username || null;
        this.firstname = data.firstname || null;
        this.lastname = data.lastname || null;
        this.role = data.role || "Project manager";
        this.email = data.email || null;
        this.password = data.password || null;
    }

    setPassword(password) {
        this.password = this._generateHash(password)
    }

    checkPassword(password) {
        return this.password == this._generateHash(password)
    }


    static all(){
        return new Promise(function (resolve, reject) {
            user.find({}).then(function (users) {
                var temp = [];
                users.forEach((user) =>{
                    temp.push(new User(user));
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
    static find(search){
        return new Promise(function (resolve, reject) {
            user.find(search).then(function (users) {
                var temp = [];
                users.forEach((user) =>{
                    temp.push(new User(user));
                })
                resolve(temp);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static likeString(key, value){
        return new Promise(function (resolve, reject) {
            user.find({}).then(function (users) {
                var temp = [];
                users.forEach((user) =>{
                    if(_.includes(user[key],value)){
                        temp.push(new User(user));
                    }                    
                })
                resolve(temp);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static findByUserName(name) {
        return new Promise(function (resolve, reject) {
            user.findOne({ username: name }).then(function (u) {
                var instance = new User(u);
                resolve(instance);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static findById(id) {
        return new Promise(function (resolve, reject) {
            user.findOne({ _id: id }).then(function (u) {
                var instance = new User(u);
                resolve(instance);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    save() {
        var self = this;
        return new Promise(function (resolve, reject) {
            console.log(self.id);
            user.remove({ id: self.id }).then(function (u) {
                user.insert(self).then(function (u) {
                    resolve(new User(u));
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }

    static remove(id) {
        return new Promise(function (resolve, reject) {
            user.remove({ id: id }).then(function (u) {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    _generateHash(password) {
        var sha256 = crypto.createHash('sha256').update(password).digest("hex");
        console.log(sha256);
        return sha256;
    }
}

module.exports = User;