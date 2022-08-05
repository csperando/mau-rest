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
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

})
.post((req, res, next) => {
    try {
        var salt = crypto.randomBytes(32).toString("hex");
        req.body.salt = salt;
    } catch(error) {
        // console.error(error);
        console.error("Error creating salt");
    }

    // salt and hash password, and update the request object
    crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", (error, hash) => {
        const hashedPassword = hash.toString("hex");
        if(error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            var output = {
                statusCode: 500,
                message: error.message
            };
            res.json(output);
            next();
        }

        req.body.password = hashedPassword;
        const newUser = User.create(req.body);
        newUser.then((user) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            var output = {
                statusCode: 200,
                message: `Created new user: ${req.body.username}`
            };
            res.json(output);

        }).catch((error) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            var output = {
                statusCode: 500,
                message: `Error creating new user: ${error.message}`
            };
            res.json(output);

        }).finally(() => {
            next();

        });

    });

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

});


userRouter.route("/login")
.get((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

})
.post((req, res, next) => {
    if("u" in req) {
        // console.log(req);
        // console.log(`already logged in as ${req.u.username}`);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
            statusCode: 200,
            message: `already logged in as ${req.u.username}`,
            data: req.u
        });
        next();

    } else {
        const findUser = User.find({username: req.body.username});
        findUser.then((found) => {
            if(found.length != 1) {
                throw(message=`Error getting username [${req.body.username}], count: ${found.length}`);
            }

            var userSalt = found[0].salt || "";
            crypto.pbkdf2(req.body.password, userSalt, 310000, 32, 'sha256', function(err, hashedPassword) {
                // console.log(hashedPassword.toString("hex"));

                var valid = (found[0].password == hashedPassword.toString("hex"));
                if(valid) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");

                    let u = {
                        username: found[0].username,
                        firstName: found[0].firstName,
                        lastName: found[0].lastName,
                        email: found[0].email,
                        roles: found[0].roles,
                        id: found[0]._id
                    };
                    res.cookie("u", JSON.stringify(u), {signed: true});

                    res.json({
                        statusCode: 200,
                        message: `login user: ${req.body.username}`,
                        data: u
                    });
                } else {
                    res.statusCode = 401;
                    res.setHeader("Content-Type", "application/json");
                    res.json({
                        statusCode: 401,
                        message: "bad username/password"
                    });
                }

                next();

            });

        }).catch((error) => {
            console.error(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({
                statusCode: 500,
                message: error.message
            });
            next();

        });

    }

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();
});


userRouter.route("/logout")
.get((req, res, next) => {
    try {
        res.clearCookie("u");
        delete req.u;
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
            statusCode: 200,
            message: "logged out"
        });

    } catch(e) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({
            statusCode: 500,
            message: e.message
        });

    } finally {
        next();

    }
})
.post((req, res, next) => {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 405,
        message: "Not allowed."
    });
    next();
})
.put((req, res, next) => {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 405,
        message: "Not allowed."
    });
    next();
})
.delete((req, res, next) => {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json({
        statusCode: 405,
        message: "Not allowed."
    });
    next();
});


// userRouter.route("/user/:userId")
// .get((req, res, next) => {
//
// })
// .post((req, res, next) => {
//
// })
// .put((req, res, next) => {
//
// })
// .delete((req, res, next) => {
//
// });


module.exports = userRouter;
