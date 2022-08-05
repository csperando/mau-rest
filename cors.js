const express = require("express");
const bodyParser = require("body-parser");

const allowList = ["localhost", "csperando.github.io"];

function cors(req, res, next) {
    let h = req.hostname;
    if(allowList.indexOf(h) != -1) {
        // console.log(`Request from [${h}] allowed.`);
        res.setHeader("Access-Control-Allow-Origin", "https://" + h);

    } else {
        // console.log(`Error: hostname [${h}] is not allowed. Accepted hosts are ${JSON.stringify(allowList)}`);

    }

    next();
}

module.exports = cors;
