const express = require("express");
const router = express.Router();
const missionController = require("../controllers/MissionController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, missionController.getAllMissions);
router.get("/:id", auth.authenticate, missionController.getMissionById);

router.post("/", auth.authenticate, auth.requireRole("mike", "admin"), missionController.createMission);
router.patch("/:id", auth.authenticate, auth.requireRole("mike", "admin"), missionController.updateMission);
router.delete("/:id", auth.authenticate, auth.requireRole("admin"), missionController.deleteMission);

module.exports = router;
