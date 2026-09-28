const mongoose = require("mongoose");

const MissionSchema = mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    // pingpong / lostFound
    type: {
        type: String,
        enum: ["pingpong", "lostFound"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "active", "completed", "failed"],
        default: "pending",
    },
    reward: {
        type: Number,
        default: 200,
    },
    targetCount: {
        type: Number,
        default: 20,
    },
    collectedCount: {
        type: Number,
        default: 0,
    },
    // for lostFound mission, e.g. kitchen / toilet / sofa
    targetLocation: {
        type: String,
    },
    timeLimit: {
        type: Number,
        default: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
    },
});

const Mission = mongoose.model("mission", MissionSchema);
module.exports = Mission;
