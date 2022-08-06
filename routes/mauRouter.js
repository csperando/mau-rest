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
        res.statusCode = 200;
        var output = JSON.stringify(games, null, 2);
        res.write(output);

    }).catch((error) => {
        res.statusCode = 500;

    }).finally(() => {
        next();

    });

})
.post((req, res, next) => {
    const newGame = Game.create(req.body);
    newGame.then((g) => {
        res.statusCode = 200;
        res.json(g);

    }).catch((error) => {
        res.statusCode = 500;
        res.json({
            statusCode: 500,
            message: error.message
        });

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
