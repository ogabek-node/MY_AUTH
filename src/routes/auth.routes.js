const express = require("express");
const {
    register,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword,
} = require("../controller/auth.controller");
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetCodeSchema,
    resetPasswordSchema,
} = require("../validation/auth.validation");

const router = express.Router();

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    req.body = value;
    next();
};

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-reset-code", validate(resetCodeSchema), verifyResetCode);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;