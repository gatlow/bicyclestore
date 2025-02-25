const speakeasy = require("speakeasy");
const User = require("../models/User");

exports.setupTwoFactor = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = speakeasy.generateSecret({ length: 20 });
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      secret: secret.base32,
      qrCodeUrl: `otpauth://totp/YourApp:${user.email}?secret=${secret.base32}&issuer=YourApp`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.enableTwoFactor = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!verified) return res.status(400).json({ message: "Invalid token" });

    user.isTwoFactorEnabled = true;
    await user.save();

    res.json({ message: "2FA enabled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.verifyTwoFactor = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!verified) return res.status(400).json({ message: "Invalid token" });

    res.json({ message: "2FA verification successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};