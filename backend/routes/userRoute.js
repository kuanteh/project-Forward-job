const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const auth = require("../middlewares/auth");

router.use(express.json());

// character select (no password)
router.post("/select-character", userController.selectCharacter);

// character list can load before token
router.get("/", userController.getAllUsers);
router.get("/:id", auth.authenticate, userController.getUserById);

// Howie (admin) manage users
router.post("/", auth.authenticate, auth.requireRole("admin"), userController.createUser);
router.patch("/:id", auth.authenticate, auth.requireRole("admin"), userController.updateUser);
router.delete("/:id", auth.authenticate, auth.requireRole("admin"), userController.deleteUser);

module.exports = router;
