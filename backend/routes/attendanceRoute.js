const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/AttendanceController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, attendanceController.getAllAttendance);

router.post("/", auth.authenticate, auth.requireRole("teacher"), attendanceController.createAttendance);
router.patch("/:id", auth.authenticate, auth.requireRole("office"), attendanceController.updateAttendance);
router.delete("/:id", auth.authenticate, auth.requireRole("office"), attendanceController.deleteAttendance);

module.exports = router;
