const Joi = require("joi");

const passwordRule =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const createUserSchema = Joi.object({
    username: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().pattern(passwordRule).required(),
});

const updateUserSchema = Joi.object({
    username: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().pattern(passwordRule).optional(),
});

module.exports = { createUserSchema, updateUserSchema };
