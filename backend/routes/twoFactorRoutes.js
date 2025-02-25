
const express = require("express");
const twoFactorController = require("../controllers/twoFactorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/setup", authMiddleware, twoFactorController.setupTwoFactor);
router.post("/enable", authMiddleware, twoFactorController.enableTwoFactor);
router.post("/verify", twoFactorController.verifyTwoFactor);

module.exports = router;