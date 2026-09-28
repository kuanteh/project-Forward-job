const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["present", "absent", "late"],
        required: true,
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    note: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Attendance = mongoose.model("attendance", AttendanceSchema);
module.exports = Attendance;
