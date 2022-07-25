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

    // LKJHSALKJHLFSAKJHA:KJDHLKA

    // // generate salt
    // try {
    //     var salt = crypto.randomBytes(32).toString("hex");
    //     req.body.salt = salt;
    //     console.log(`generate salt: ${req.body.salt}`);
    //
    // } catch(error) {
    //     console.error(error);
    //
    // }
    //
    // // salt and hash password, and update the request object
    // const hash = crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", (error, hash) => {
    //     console.log(`salt hashing password: ${hash.toString("hex")}`);
    //
    //     if(error) {
    //         return false;
    //     } else {
    //         return hash.toString("hex");
    //     }
    // });
    //
    // req.body.password = (hash) ? hash : "error";
    // console.log(`update request with hash: ${req.body.password}`);
    //
    // // Check for duplicates
    // const duplicates = User.find({username: req.body.username});
    // duplicates.then((d) => {
    //     console.log("Checking for duplicates");
    //     if(d.length != 0) {
    //         res.statusCode = 500;
    //         throw("user already exists");
    //     }
    //     return d;
    //
    // }).then(() => {
    //     // create new user
    //     console.log("creating new user");
    //     const newUser = User.create(req.body);
    //     newUser.then((user) => {
    //         res.statusCode = 200;
    //         console.log("success");
    //
    //     }).catch((error) => {
    //         res.statusCode = 500;
    //         console.log("error on create");
    //
    //     });
    //
    // }).catch((error) => {
    //     res.statusCode = 500;
    //
    // }).finally(() => {
    //     console.log("all done, next");
    //     next();
    //
    // });

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

        const valid = crypto.pbkdf2(req.body.password, found.salt || "", 310000, 32, 'sha256', function(err, hashedPassword) {
            // console.log(req.body.password);
            // console.log(hashedPassword.toString("hex"));
            return found.password == hashedPassword.toString("hex");
        });

        if(valid) {
            return found;

        } else {
            throw("bad username or email");

        }


    }).then((found) => {
        res.statusCode = 200;
        res.write(`login user: ${req.body.username}`);

    }).catch((error) => {
        res.statusCode = 500;
        console.error(error);

    }).finally(() => {
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
