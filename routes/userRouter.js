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

            var output = {
                statusCode: 200,
                message: `Created new user: ${req.body.username}`
            };
            res.json(output);

        }).catch((error) => {
            res.statusCode = 500;

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

    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;

    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

});


userRouter.route("/login")
.get((req, res, next) => {
    res.statusCode = 405;

    res.json({
        statusCode: 405,
        message: "Not allowed."
    });
    next();

})
.post((req, res, next) => {

    try {
        if("u" in req) {
            res.statusCode = 200;
            res.json({
                statusCode: 200,
                message: `already logged in as ${req.u.username}`,
                data: req.u
            });
            next();

        } else {
            const findUser = User.find({username: req.body.username});
            findUser.then((found) => {
                if(found.length == 0) {
                    throw(`Username [${req.body.username}] does not exist.`);
                } else if(found.length > 1) {
                    throw(`Error: duplicate [${found.length}] usernames for [${req.body.username}]. Please report a bug.`);
                }

                var userSalt = found[0].salt || "";
                crypto.pbkdf2(req.body.password, userSalt, 310000, 32, 'sha256', function(err, hashedPassword) {
                    var valid = (found[0].password == hashedPassword.toString("hex"));
                    if(valid) {
                        res.statusCode = 200;
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
                        res.json({
                            statusCode: 401,
                            message: "bad username/password"
                        });
                    }

                    next();

                });

            }).catch((error) => {
                console.error(error);
                console.log(error.message);
                res.statusCode = 500;
                res.json({
                    statusCode: 500,
                    message: error.message
                });
                next();

            });
        }

    } catch(error) {
        res.statusCode = 500;
        res.json({
            statusCode: 500,
            message: error.message
        });
        next();
    }

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;

    res.json({
        statusCode: 403,
        message: "Not allowed."
    });
    next();
});


userRouter.route("/login/:uid")
.get((req, res, next) => {

    const found = User.find({_id: req.params.uid});
    found.then((users) => {
        let u = users[0];
        let data = {
            username: u.username,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            roles: u.roles,
            id: u._id
        };

        res.statusCode = 200;
        res.json({
            statusCode: 200,
            message: `logged in as ${u.username}`,
            data: data
        });

    }).catch((error) => {
        console.error(error);
        res.statusCode = 500;
        res.json({
            statusCode: 500,
            message: error.message
        });

    }).finally(() => {
        next();

    });


})
.post((req, res, next) => {
    res.statusCode = 405;

    res.json({
        statusCode: 405,
        message: "Not allowed."
    });
    next();
})
.put((req, res, next) => {
    res.statusCode = 405;

    res.json({
        statusCode: 405,
        message: "Not allowed."
    });
    next();
})
.delete((req, res, next) => {
    res.statusCode = 405;

    res.json({
        statusCode: 405,
        message: "Not allowed."
    });
    next();
});


// userRouter.route("/logout")
// .get((req, res, next) => {
//     try {
//         res.clearCookie("u");
//         delete req.u;
//         res.statusCode = 200;
//
//         res.json({
//             statusCode: 200,
//             message: "logged out"
//         });
//
//     } catch(e) {
//         res.statusCode = 500;
//
//         res.json({
//             statusCode: 500,
//             message: e.message
//         });
//
//     } finally {
//         next();
//
//     }
// })
// .post((req, res, next) => {
//     res.statusCode = 405;
//
//     res.json({
//         statusCode: 405,
//         message: "Not allowed."
//     });
//     next();
// })
// .put((req, res, next) => {
//     res.statusCode = 405;
//
//     res.json({
//         statusCode: 405,
//         message: "Not allowed."
//     });
//     next();
// })
// .delete((req, res, next) => {
//     res.statusCode = 405;
//
//     res.json({
//         statusCode: 405,
//         message: "Not allowed."
//     });
//     next();
// });


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
