const express = require("express");
const authController = require("../controllers/authController");

const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();

const { validateRegister, validateLogin } = require("../Middleware/validationMiddleware");

// Routes for user management
router.put("/update", authMiddleware, authController.updateUser);
router.delete("/delete", authMiddleware, authController.deleteUser);

// Routes for registration and login
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

router.post("/2fa/generate", authController.generate2FASecret); // Generate secret and QR code
router.post("/2fa/enable", authController.enable2FA); // Enable 2FA
router.post("/2fa/verify", authController.verify2FA); // Verify 2FA code

// Route for toggling two-factor authentication
router.post("/toggleTwoFactor", authMiddleware, authController.toggleTwoFactor);

module.exports = router;
