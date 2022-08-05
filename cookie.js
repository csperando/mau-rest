const express = require("express");
const cookieParser = require("cookie-parser");

function cookie(req, res, next) {
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

module.exports = cookie;
