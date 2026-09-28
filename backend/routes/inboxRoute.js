const express = require("express");
const router = express.Router();
const inboxController = require("../controllers/InboxController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, inboxController.getAllInbox);
router.get("/:id", auth.authenticate, inboxController.getInboxById);

// office / admin can send messages (Melissa tuition, Kher Nee warning)
router.post("/", auth.authenticate, auth.requireRole("office", "admin", "teacher"), inboxController.createInbox);
router.patch("/:id", auth.authenticate, inboxController.updateInbox);
router.delete("/:id", auth.authenticate, auth.requireRole("office", "admin"), inboxController.deleteInbox);

module.exports = router;
