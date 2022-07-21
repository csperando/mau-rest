const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Game = require("../models/game");


const mauRouter = express.Router();
mauRouter.use(bodyParser.json());


mauRouter.route("/")
.get((req, res, next) => {
    const gameData = Game.find({});
    gameData.then((games) => {
        // console.log(games);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        var output = JSON.stringify(games, null, 2);
        res.write(output);

    }).catch((error) => {
        // console.error(error);
        res.statusCode = 500;

    }).finally(() => {
        next();

    });

})
.post((req, res, next) => {
    const newGame = Game.create(req.body);
    newGame.then((g) => {
        // console.log(g);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        var output = JSON.stringify(g, null, 2);
        res.write(output);

    }).catch((error) => {
        // console.error(error);
        res.statusCode = 500;
        res.write(error.message);

    }).finally(() => {
        next();

    });

})
.put((req, res, next) => {
    res.statusCode = 403;
    next();

})
.delete((req, res, next) => {
    res.statusCode = 403;
    next();

});

module.exports = mauRouter;
