const Attendance = require("../models/Attendance");

// GET /attendance?student=...&status=present&date=2026-09-24
exports.getAllAttendance = async (req, res) => {
    try {
        const filter = {};

        if (req.query.student) filter.student = req.query.student;
        if (req.query.status) filter.status = req.query.status;

        if (req.query.date) {
            const day = new Date(req.query.date);
            const nextDay = new Date(day);
            nextDay.setDate(day.getDate() + 1);
            filter.date = { $gte: day, $lt: nextDay };
        }

        // student only see own attendance
        if (req.user.role === "student") {
            filter.student = req.user._id;
        }

        const records = await Attendance.find(filter)
            .populate("student", "name characterName role")
            .populate("markedBy", "name characterName role")
            .sort({ date: -1 });

        res.json(records);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAttendanceById = async (req, res) => {
    try {
        const record = await Attendance.findById(req.params.id)
            .populate("student", "name characterName role")
            .populate("markedBy", "name characterName role");

        if (!record) throw new Error("Attendance record not found");
        res.json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createAttendance = async (req, res) => {
    try {
        const record = new Attendance({
            ...req.body,
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

exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Attendance.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
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
