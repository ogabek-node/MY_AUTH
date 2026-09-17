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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Foydalanuvchi yaratildi
 *       400:
 *         description: Noto'g'ri ma'lumot
 */
router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli login
 *       401:
 *         description: Email yoki parol xato
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Parolni tiklash so'rovi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       200:
 *         description: Kod emailga yuborildi
 */
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /api/auth/verify-reset-code:
 *   post:
 *     summary: Parol tiklash kodini tasdiqlash
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetCodeRequest'
 *     responses:
 *       200:
 *         description: Kod tasdiqlandi
 *       400:
 *         description: Kod noto'g'ri yoki muddati tugagan
 */
router.post("/verify-reset-code", validate(resetCodeSchema), verifyResetCode);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Yangi parol o'rnatish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Parol tiklandi
 *       400:
 *         description: Kod tasdiqlanmagan
 */
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;