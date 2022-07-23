const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("../models/users");


const userRouter = express.Router();
userRouter.use(bodyParser.json());


userRouter.route("/signup")
.get((req, res, next) => {
    res.statusCode = 403;
    res.write("not allowed");
    next();

})
.post((req, res, next) => {
    const newUser = User.create(req.body);
    newUser.then((u) => {
        res.statusCode = 200;
        var output = JSON.stringify(u, null, 2);
        res.write(output);
        next();

    }).catch((error) => {
        res.statusCode = 500;
        res.write(error.message);
        next();

    })

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
    res.statusCode = 200;
    res.write("login user");
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
