const User = require("../models/User");
const Inbox = require("../models/Inbox");
const Attendance = require("../models/Attendance");
const Mission = require("../models/Mission");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// select character -> get JWT (no password)
exports.selectCharacter = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) throw new Error("Character not found");

        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                characterName: user.characterName,
                money: user.money,
                image: user.image,
                isProtected: user.isProtected,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET /users?role=student&name=Yi
// no auth needed so Character page can load first
exports.getAllUsers = async (req, res) => {
    try {
        const filter = {};

        if (req.query.role) {
            filter.role = req.query.role;
        }
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: "i" };
        }
        if (req.query.characterName) {
            filter.characterName = { $regex: req.query.characterName, $options: "i" };
        }

        const users = await User.find(filter);
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new Error("User not found");
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Howie create user
exports.createUser = async (req, res) => {
    try {
        // only one Mike , cannot create another
        if (req.body.role === "mike") {
            throw new Error("Cannot create another Mike");
        }
        if (!req.body.characterName) {
            throw new Error("characterName is required");
        }
        if (!req.body.image) {
            throw new Error("Image is required");
        }

        const user = new User({
            ...req.body,
            isProtected: false,
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");

        // cannot turn someone into mike
        if (req.body.role === "mike" && user.role !== "mike") {
            throw new Error("Cannot change role to mike");
        }
        // core 5 cannot change role
        if (user.isProtected && req.body.role && req.body.role !== user.role) {
            throw new Error("Cannot change role of a core character");
        }

        // dont let frontend flip isProtected
        const body = { ...req.body };
        delete body.isProtected;

        const updatedUser = await User.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");
        if (user.isProtected) throw new Error("Cannot delete core character");

        // delete their inbox / attendance / mission together
        await Inbox.deleteMany({ $or: [{ from: id }, { to: id }] });
        await Attendance.deleteMany({ $or: [{ student: id }, { markedBy: id }] });
        await Mission.deleteMany({ player: id });

        await User.findByIdAndDelete(id);
        res.status(204).json({ message: "User detele success" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
