const Inbox = require("../models/Inbox");

// GET /inbox?to=...&from=...&type=tuition
exports.getAllInbox = async (req, res) => {
    try {
        const filter = {};

        if (req.query.to) filter.to = req.query.to;
        if (req.query.from) filter.from = req.query.from;
        if (req.query.type) filter.type = req.query.type;
        if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === "true";

        // normal user only see their own inbox
        if (req.user.role !== "admin") {
            filter.to = req.user._id;
        }

        const messages = await Inbox.find(filter)
            .populate("from", "name role characterName")
            .populate("to", "name role characterName")
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getInboxById = async (req, res) => {
    try {
        const message = await Inbox.findById(req.params.id)
            .populate("from", "name role characterName")
            .populate("to", "name role characterName");

        if (!message) throw new Error("Message not found");

        // only admin / sender / receiver can read
        const isOwner =
            message.to._id.equals(req.user._id) ||
            message.from._id.equals(req.user._id) ||
            req.user.role === "admin";

        if (!isOwner) {
            throw new Error("You do not have permission to view this message");
        }

        res.json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createInbox = async (req, res) => {
    try {
        const newMessage = new Inbox({
            ...req.body,
            from: req.body.from || req.user._id,
        });
        await newMessage.save();

        const populated = await Inbox.findById(newMessage._id)
            .populate("from", "name role characterName")
            .populate("to", "name role characterName");

        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateInbox = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Inbox.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate("from", "name role characterName")
            .populate("to", "name role characterName");

        if (!updated) throw new Error("Message not found");
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteInbox = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Inbox.findByIdAndDelete(id);
        if (!deleted) throw new Error("Message not found");
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
