const mongoose = require("mongoose");

const MissionSchema = mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        default: "Shoot 10 targets",
    },
    // which pov : pingpong / sofa / event
    type: {
        type: String,
        enum: ["pingpong", "sofa", "event"],
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
    reward: {
        type: Number,
        default: 67000,
    },
    collectedCount: {
        type: Number,
        default: 0,
    },
    targetCount: {
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
