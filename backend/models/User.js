const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  twoFactorSecret: { type: String }, // Секрет для 2FA
  isTwoFactorEnabled: { type: Boolean, default: false }, // Статус 2FA
});

// Хук для хеширования пароля перед сохранением
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);