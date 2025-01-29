const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/auth");
// const { auth } = require("../middlewares/auth");

// Routes
router.post("/register", userController.registerUser);
router.get("/", userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);
router.post("/login", userController.loginUser);
router.get('/authenticated',  authMiddleware, userController.authenticated);
router.patch("/:id", userController.updateUser);

module.exports = router;