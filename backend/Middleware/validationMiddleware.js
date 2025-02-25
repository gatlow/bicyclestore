const Joi = require("joi");

// Схема валидации для регистрации
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Схема валидации для входа
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Промежуточное ПО для валидации регистрации
const validateRegister = (req, res, next) => {
    console.log("Входящие данные для регистрации:", req.body); // Логирование входящих данных
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Промежуточное ПО для валидации входа
const validateLogin = (req, res, next) => {
    console.log("Входящие данные для входа:", req.body); // Логирование входящих данных
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
};
