const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "teacher", "office", "admin", "mike"],
        required: true,
    },
    characterName: {
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

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = bcrypt.hashSync(this.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
