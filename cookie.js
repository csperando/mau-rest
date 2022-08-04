const express = require("express");
const cookieParser = require("cookie-parser");

function auth(req, res, next) {
    try {
        if(req.signedCookies) {
            let u = JSON.parse(req.signedCookies.u);
            req.u = u;

        }
    } catch (e) {
        // console.log("error parsing cookie");

    } finally {
        next();

    }
}

module.exports.auth = auth;
