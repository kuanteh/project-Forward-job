const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["student", "teacher", "office", "admin", "mike"],
        required: true,
    },
    characterName: {
        type: String,
    },
    // character image url , can be local like /image/xxx.png
    image: {
        type: String,
        required: true,
    },
    // seed 5 characters cannot be deleted
    isProtected: {
        type: Boolean,
        default: false,
    },
    money: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
