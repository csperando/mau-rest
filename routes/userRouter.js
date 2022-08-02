const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("../models/users");
const crypto = require("crypto");


const userRouter = express.Router();
userRouter.use(bodyParser.json());


userRouter.route("/signup")
.get((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.post((req, res, next) => {
    try {
        var salt = crypto.randomBytes(32).toString("hex");
        req.body.salt = salt;
    } catch(error) {
        console.error(error);
    }

    // salt and hash password, and update the request object
    crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", (error, hash) => {
        const hashedPassword = hash.toString("hex");
        if(error) {
            console.error(error);
        }

        req.body.password = hashedPassword;
        const newUser = User.create(req.body);
        newUser.then((user) => {
            res.statusCode = 200;
            var output = JSON.stringify(user, null, 2);
            res.write(output);

        }).catch((error) => {
            res.statusCode = 500;

        }).finally(() => {
            next();

        });

    });

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

});


userRouter.route("/login")
.get((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.post((req, res, next) => {
    const findUser = User.find({username: req.body.username});
    findUser.then((found) => {
        if(found.length != 1) {
            throw(message="Error getting username");
        }

        // console.log(found[0].password);

        var userSalt = found[0].salt || "";
        crypto.pbkdf2(req.body.password, userSalt, 310000, 32, 'sha256', function(err, hashedPassword) {
            // console.log(hashedPassword.toString("hex"));

            var valid = (found[0].password == hashedPassword.toString("hex"));
            if(valid) {
                res.statusCode = 200;
                res.write(`login user: ${req.body.username}`);
            } else {
                res.statusCode = 500;
                res.write("bad username/password");
            }

            next();

        });

    }).catch((error) => {
        console.error(error);
        next();

    });

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();
});


userRouter.route("/logout")
.get((req, res, next) => {
    res.statusCode = 200;
    res.write("logged out");
    next();

})
.post((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();
});


userRouter.route("/user/:userId")
.get((req, res, next) => {
    res.statusCode = 200;
    res.write(`get user ${req.params.userId}`);
    next();

})
.post((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.put((req, res, next) => {
    res.statusCode = 200;
    res.write(`update user ${req.params.userId}`);
    next();

})
.delete((req, res, next) => {
    res.statusCode = 200;
    res.write(`delete user ${req.params.userId}`);
    next();

});


module.exports = userRouter;
