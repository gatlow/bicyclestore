const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Токен отсутствует" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Ошибка аутентификации:", error);
        res.status(401).json({ message: "Ошибка аутентификации" });
    }
};

module.exports = authMiddleware;
