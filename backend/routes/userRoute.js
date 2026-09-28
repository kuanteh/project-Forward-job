const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/", auth.authenticate, userController.getAllUsers);
router.get("/:id", auth.authenticate, userController.getUserById);

// Howie (admin) manage users
router.post("/", auth.authenticate, auth.requireRole("admin"), userController.createUser);
router.patch("/:id", auth.authenticate, auth.requireRole("admin"), userController.updateUser);
router.delete("/:id", auth.authenticate, auth.requireRole("admin"), userController.deleteUser);

module.exports = router;
