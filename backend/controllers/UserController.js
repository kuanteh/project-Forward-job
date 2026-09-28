const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !user.comparePassword(req.body.password)) {
            throw new Error("Invalid email or password");
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            // process 读取 ， 拿env 的 jwt
            // 使用我的 jwt 对 token 加密
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
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET /users?role=student&name=Yi
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

        const users = await User.find(filter).select("-password");
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
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
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // if password is updated, need to hash via save()
        if (req.body.password) {
            const user = await User.findById(id);
            if (!user) throw new Error("User not found");
            Object.assign(user, req.body);
            await user.save();
            const userObj = user.toObject();
            delete userObj.password;
            return res.json(userObj);
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).select("-password");

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
        res.status(204).json({ message:"User detele success"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
