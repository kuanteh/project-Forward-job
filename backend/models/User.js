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
    // character image url
    image: {
        type: String,
    },
    // for office staff: kherNee / melissa
    officeRole: {
        type: String,
        enum: ["kherNee", "melissa"],
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
