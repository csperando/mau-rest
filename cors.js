const express = require("express");
const bodyParser = require("body-parser");

const allowList = ["localhost:5000", "localhost:3000", "csperando.github.io"];

function cors(req, res, next) {
    // console.log(req.headers);
    let h = ("x-client-host" in req.headers) ? req.get("x-client-host") : "Error: no hostname";

    if(allowList.indexOf(h) != -1) {
        console.log(`Request from [${h}] allowed.`);
        res.setHeader("Access-Control-Allow-Origin", "https://" + h);

    } else {
        console.log(`Error: hostname [${h}] is not allowed. Accepted hosts are ${JSON.stringify(allowList)}`);

    }

    next();
}

module.exports = cors;
