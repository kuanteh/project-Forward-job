const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/AttendanceController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, attendanceController.getAllAttendance);
router.get("/:id", auth.authenticate, attendanceController.getAttendanceById);

// office / teacher / admin manage attendance
router.post("/", auth.authenticate, auth.requireRole("office", "teacher", "admin"), attendanceController.createAttendance);
router.patch("/:id", auth.authenticate, auth.requireRole("office", "teacher", "admin"), attendanceController.updateAttendance);
router.delete("/:id", auth.authenticate, auth.requireRole("office", "admin"), attendanceController.deleteAttendance);

module.exports = router;
