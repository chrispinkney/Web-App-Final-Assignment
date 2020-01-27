const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema ({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User; // to be defined on new connection (see initialize)

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://dbUser:p@ssword@senecaweb-hnfng.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});
        
        db.on('error', (err)=>{
            reject(err);
        });
        
        db.once('open', ()=>{
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function(userData) {
    return new Promise(function(resolve, reject) {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        }
        else {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userData.password, salt, function(err, hash) {
                    if (err) {
                        reject("There was an error encrypting the password");
                    }
                    else {
                        userData.password = hash;
                        var newUser = new User(userData);
                        newUser.save(function(err) {
                            if (err) {
                                if (err.code == 11000) {
                                    reject("User Name already taken");
                                }
                                reject("There was an error creating the user: " + err);
                            }
                            else {
                                resolve();
                            }
                        })
                    }
                })
                
            })
        }
    });
};

module.exports.checkUser = function(userData) {
    return new Promise(function(resolve, reject) {
        User.find({userName: userData.userName})
            .exec()
            .then(function(users) {
                if(!users) {
                    reject("Unable to find user: " + userData.userName);
                }
                else {
                    bcrypt.compare(userData.password, users[0].password)
                    .then(function(res) {
                        if(res) {
                            users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                            User.update(
                                { userName: users[0].userName },
                                { $set: {
                                    loginHistory: users[0].loginHistory 
                                }},
                                { multi: false }
                            )
                            .exec()
                            .then((function() {
                                resolve(users[0]);
                            }))
                            .catch(function(err) {
                                reject("There was an error verifying the user: " + err);
                            });
                        }
                        else {
                            reject("Incorrect Password for user: " + userData.userName);
                        }
                    })
                }
            }).catch(function() {
                reject("Unable to find user: " + userData.userName);
            })
    });
};