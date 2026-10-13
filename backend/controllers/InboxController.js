const Inbox = require("../models/Inbox");

// GET /inbox?box=sent&isRead=false
exports.getAllInbox = async (req, res) => {
    try {
        const filter = {};

        if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === "true";

        // inbox = letters to me , sent = letters i wrote
        if (req.query.box === "sent") {
            filter.from = req.user._id;
        } else {
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
        const message = await Inbox.findById(id);
        if (!message) throw new Error("Message not found");

        const isSender = message.from.equals(req.user._id);
        const isReceiver = message.to.equals(req.user._id);

        // only sender can edit subject / message
        if ((req.body.subject || req.body.message) && !isSender) {
            throw new Error("Only the sender can edit this letter");
        }

        if (!isSender && !isReceiver && req.user.role !== "admin") {
            throw new Error("You do not have permission to update this message");
        }

        const updated = await Inbox.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate("from", "name role characterName")
            .populate("to", "name role characterName");

        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteInbox = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Inbox.findById(id);
        if (!message) throw new Error("Message not found");

        // sender can delete own sent letter , office / admin can delete too
        const isSender = message.from.equals(req.user._id);
        const isStaff = req.user.role === "office" || req.user.role === "admin";
        if (!isSender && !isStaff) {
            throw new Error("You do not have permission to delete this message");
        }

        await Inbox.findByIdAndDelete(id);
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
