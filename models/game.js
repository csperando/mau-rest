const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const PlayerSchema = new Schema ({
    name: {
        type: String,
        required: true
    }
});

const RoundSchema = new Schema ({
    winner: {
        type: PlayerSchema,
        required: true
    },
    loser: {
        type: PlayerSchema,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    // overall: {
    //     type: [Number],
    //     required: true
    // }
});

const gameSchema = new Schema ({
    players: {
        type: [PlayerSchema],
        required: true
    },
    winner: {
        type: PlayerSchema,
        required: true
    },
    loser: {
        type: PlayerSchema,
        required: true
    },
    overall: {
        type: [Number],
        required: true
    },
    rounds: {
        type: [RoundSchema],
        required: true
    }
}, {
    timestamps: true
});


var Game = mongoose.model("Game", gameSchema);
module.exports = Game;
