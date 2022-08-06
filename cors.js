const express = require("express");
const bodyParser = require("body-parser");

const allowList = ["http://localhost:5000", "http://localhost:3000", "https://csperando.github.io"];

function cors(req, res, next) {
    console.log(req.headers);
    let h = ("origin" in req.headers) ? req.get("origin") : "Error: no hostname";
    let r = ("referrer" in req.headers) ? req.get("referrer") : "Error: no referrer";

    if(allowList.indexOf(h) != -1) {
        // console.log(`Request from [${h}] allowed.`);
        res.setHeader("Access-Control-Allow-Origin", h);
        res.setHeader("origin", "vary");

    } else if(allowList.indexOf(r) != -1) {
        res.setHeader("Access-Control-Allow-Origin", r);
        res.setHeader("origin", "vary");

    } else {
        // console.log(`Error: hostname [${h}] is not allowed. Accepted hosts are ${JSON.stringify(allowList)}`);
        res.setHeader("Access-Control-Allow-Origin", "*");

    }

    next();
}

module.exports = cors;
