const User = require("../models/User");
const speakeasy = require("speakeasy");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");

// Включение/отключение двухфакторной аутентификации
exports.toggleTwoFactor = async (req, res) => {
    const userId = req.user.id; // Теперь req.user будет определен

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        user.isTwoFactorEnabled = !user.isTwoFactorEnabled;
        await user.save();

        res.status(200).json({ message: `Двухфакторная аутентификация ${user.isTwoFactorEnabled ? 'включена' : 'выключена'}` });
    } catch (error) {
        console.error("Ошибка переключения двухфакторной аутентификации:", error);
        res.status(500).json({ message: "Ошибка переключения двухфакторной аутентификации" });
    }
};

// Генерация секрета и QR-кода для 2FA
exports.generate2FASecret = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Генерация секрета
        const secret = speakeasy.generateSecret({ name: "bicycle store" });

        // Сохранение секрета в базе данных
        user.twoFactorSecret = secret.base32;
        await user.save();

        // Генерация QR-кода
        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                return res.status(500).json({ message: "Ошибка генерации QR-кода" });
            }

            res.json({ secret: secret.base32, qrCode: data_url });
        });
    } catch (error) {
        console.error("Ошибка генерации секрета 2FA:", error);
        res.status(500).json({ message: "Ошибка генерации секрета 2FA" });
    }
};

// Включение 2FA после подтверждения кода
exports.enable2FA = async (req, res) => {
    const { userId, token } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Проверка кода
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: token,
        });

        if (!verified) {
            return res.status(400).json({ message: "Неверный код" });
        }

        // Включение 2FA
        user.isTwoFactorEnabled = true;
        await user.save();

        res.json({ message: "Двухфакторная аутентификация включена" });
    } catch (error) {
        console.error("Ошибка включения 2FA:", error);
        res.status(500).json({ message: "Ошибка включения 2FA" });
    }
};

// Проверка кода 2FA при входе
exports.verify2FA = async (req, res) => {
    const { userId, token } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Проверка кода
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: token,
        });

        if (!verified) {
            return res.status(400).json({ message: "Неверный код" });
        }

        // Генерация токена
        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token: accessToken });
    } catch (error) {
        console.error("Ошибка проверки кода 2FA:", error);
        res.status(500).json({ message: "Ошибка проверки кода 2FA" });
    }
};

// Обновление данных пользователя
exports.updateUser = async (req, res) => {
    const { userId, name, email, status } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = status || user.role;
        await user.save();

        res.status(200).json({ message: "Данные пользователя обновлены" });
    } catch (error) {
        console.error("Ошибка обновления пользователя:", error);
        res.status(500).json({ message: "Ошибка обновления пользователя" });
    }
};

// Регистрация пользователя
exports.register = async (req, res) => {
    console.log("Request body:", req.body);
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Все поля обязательны" });
        }

        const user = new User({ name, email, password, twoFactorSecret: null });

        await user.save();

        res.status(201).json({ message: "Пользователь успешно зарегистрирован" });
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        res.status(500).json({ error: "Ошибка регистрации" });
    }
};

// Удаление пользователя
exports.deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.status(200).json({ message: "Пользователь удален" });
    } catch (error) {
        console.error("Ошибка удаления пользователя:", error);
        res.status(500).json({ message: "Ошибка удаления пользователя" });
    }
};

// Вход в систему
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("📩 Received login request:", req.body);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        console.log("✅ Found user:", user.email);
        console.log("🔒 Stored password (hashed):", user.password);
        console.log("🔑 Entered password:", password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔍 Password match result:", isMatch);

        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(400).json({ message: "Неверные учетные данные" });
        }

        if (user.isTwoFactorEnabled) {
            return res.json({ userId: user._id, requires2FA: true });
        }

        const token = jwt.sign({ id: user._id, role: user.role, twoFactorEnabled: user.isTwoFactorEnabled }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Login successful! Token generated.");
        res.json({ token });

    } catch (error) {
        console.error("❌ Login failed:", error);
        res.status(500).json({ message: "Ошибка входа", error: error.message });
    }
};