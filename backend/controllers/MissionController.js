const Mission = require("../models/Mission");
const User = require("../models/User");

// GET /missions?type=pingpong&status=completed
exports.getAllMissions = async (req, res) => {
    try {
        const filter = {};

        if (req.query.type) filter.type = req.query.type;
        if (req.query.status) filter.status = req.query.status;

        // mike only see own missions
        if (req.user.role !== "admin") {
            filter.player = req.user._id;
        }

        const missions = await Mission.find(filter)
            .populate("player", "name characterName role money")
            .sort({ createdAt: -1 });

        res.json(missions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMissionById = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id)
            .populate("player", "name characterName role money");

        if (!mission) throw new Error("Mission not found");
        res.json(mission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mike click Mission Start
exports.createMission = async (req, res) => {
    try {
        const mission = new Mission({
            player: req.user._id,
            title: "Shoot 10 targets",
            type: req.body.type,
            status: "active",
            reward: 67000,
            collectedCount: 0,
            targetCount: 10,
        });
        await mission.save();

        const populated = await Mission.findById(mission._id)
            .populate("player", "name characterName role money");

        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateMission = async (req, res) => {
    try {
        const { id } = req.params;
        const mission = await Mission.findById(id);
        if (!mission) throw new Error("Mission not found");

        const alreadyCompleted = mission.status === "completed";

        if (req.body.collectedCount !== undefined) {
            mission.collectedCount = req.body.collectedCount;
        }

        // first time complete -> give money
        if (req.body.status === "completed" && !alreadyCompleted) {
            mission.status = "completed";
            mission.collectedCount = mission.targetCount;
            mission.completedAt = new Date();
            await User.findByIdAndUpdate(mission.player, {
                $inc: { money: mission.reward },
            });
        }

        await mission.save();

        const populated = await Mission.findById(mission._id)
            .populate("player", "name characterName role money");

        res.json(populated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMission = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Mission.findByIdAndDelete(id);
        if (!deleted) throw new Error("Mission not found");
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
