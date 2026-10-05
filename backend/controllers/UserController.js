const User = require("../models/User");
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
                officeRole: user.officeRole,
                money: user.money,
                image: user.image,
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
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) throw new Error("User not found");
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new Error("User not found");
        res.status(204).json({ message: "User detele success" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
