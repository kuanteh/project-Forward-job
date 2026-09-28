const mongoose = require("mongoose");

const InboxSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    // tuition / warning / normal
    type: {
        type: String,
        enum: ["tuition", "warning", "normal"],
        default: "normal",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Inbox = mongoose.model("inbox", InboxSchema);
module.exports = Inbox;
