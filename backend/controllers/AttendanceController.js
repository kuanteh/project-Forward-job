const Attendance = require("../models/Attendance");

// GET /attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find()
            .populate("student", "name characterName role")
            .populate("markedBy", "name characterName role")
            .sort({ date: -1 });

        res.json(records);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createAttendance = async (req, res) => {
    try {
        const record = new Attendance({
            ...req.body, // student
            markedBy: req.body.markedBy || req.user._id,
        });
        await record.save();

        const populated = await Attendance.findById(record._id)
            .populate("student", "name characterName role")
            .populate("markedBy", "name characterName role");

        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// office only change status
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Attendance.findByIdAndUpdate(
            id,
            { status: req.body.status }, // just change this status
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("student", "name characterName role")
            .populate("markedBy", "name characterName role");

        if (!updated) throw new Error("Attendance record not found");
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Attendance.findByIdAndDelete(id);
        if (!deleted) throw new Error("Attendance record not found");
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
