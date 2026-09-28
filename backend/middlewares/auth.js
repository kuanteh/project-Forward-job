const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error("No token provided");
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId);
        if (!user) throw new Error("No user found!");
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// only allow certain roles, e.g. requireRole("admin")
exports.requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "You do not have permission to do this" });
        }
        next();
    };
};
