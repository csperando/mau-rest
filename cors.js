const express = require("express");
const bodyParser = require("body-parser");

const allowList = ["http://localhost:5000", "http://localhost:3000", "https://csperando.github.io"];

function cors(req, res, next) {
    console.log(req.headers);
    let h = ("origin" in req.headers) ? req.get("origin") : "Error: no hostname";

    if(allowList.indexOf(h) != -1) {
        console.log(`Request from [${h}] allowed.`);
        res.setHeader("Access-Control-Allow-Origin", h);

    } else {
        console.log(`Error: hostname [${h}] is not allowed. Accepted hosts are ${JSON.stringify(allowList)}`);

    }

    next();
}

module.exports = cors;
