const { pool } = require("../db/index");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const resetCodeLifetimeMs = 10 * 60 * 1000;

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

        if (result.rows.length > 0) {
            return res.status(409).json({ message: "email oldin ro'yxatdan o'tgan" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const create = await pool.query(
            "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email",
            [username, email, hashPassword]
        );

        return res.status(201).json({
            message: "muvaffaqiyatli ro'yxatdan o'tdingiz",
            user: create.rows[0],
        });
    } catch (error) {
        console.error("Ro'yxatdan o'tishda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

        if (result.rows.length === 0 ||
            !(await bcrypt.compare(password, result.rows[0].password))) {
            return res.status(401).json({ message: "email yoki password xato" });
        }

        const user = result.rows[0];
        return res.status(200).json({
            message: "login muvaffaqiyatli",
            user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error("Login vaqtida xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const forgotPassword = async (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    try {
        const result = await pool.query(
            "SELECT id FROM users WHERE LOWER(email)=LOWER($1)", [email]
        );

        if (result.rows.length > 0) {
            const code = crypto.randomInt(100000, 1000000).toString();
            const codeHash = await bcrypt.hash(code, 10);
            await pool.query(
                `UPDATE users SET reset_code_hash=$1, reset_code_expires_at=$2,
                 reset_code_verified_at=NULL WHERE id=$3`,
                [codeHash, new Date(Date.now() + resetCodeLifetimeMs), result.rows[0].id]
            );
            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: email,
                subject: "Parolni tiklash kodi",
                text: `Parolni tiklash kodingiz: ${code}. Kod 10 daqiqa amal qiladi.`,
            });
        }

        return res.status(200).json({
            message: "Agar email ro'yxatdan o'tgan bo'lsa, tasdiqlash kodi yuborildi",
        });
    } catch (error) {
        console.error("Parolni tiklash kodi yuborishda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const result = await pool.query(
            `SELECT id, reset_code_hash FROM users
             WHERE LOWER(email)=LOWER($1) AND reset_code_expires_at > NOW()`,
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0 ||
            !(await bcrypt.compare(code, result.rows[0].reset_code_hash))) {
            return res.status(400).json({ message: "Tasdiqlash kodi noto'g'ri yoki muddati tugagan" });
        }

        await pool.query("UPDATE users SET reset_code_verified_at=NOW() WHERE id=$1", [result.rows[0].id]);
        return res.status(200).json({ message: "Tasdiqlash kodi tasdiqlandi" });
    } catch (error) {
        console.error("Tasdiqlash kodini tekshirishda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        const result = await pool.query(
            `SELECT id, reset_code_hash FROM users
             WHERE LOWER(email)=LOWER($1) AND reset_code_expires_at > NOW()
             AND reset_code_verified_at IS NOT NULL`,
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0 ||
            !(await bcrypt.compare(code, result.rows[0].reset_code_hash))) {
            return res.status(400).json({ message: "Tasdiqlash kodi noto'g'ri yoki tasdiqlanmagan" });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await pool.query(
            `UPDATE users SET password=$1, reset_code_hash=NULL,
             reset_code_expires_at=NULL, reset_code_verified_at=NULL WHERE id=$2`,
            [passwordHash, result.rows[0].id]
        );
        return res.status(200).json({ message: "Parol muvaffaqiyatli tiklandi" });
    } catch (error) {
        console.error("Parolni tiklashda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

module.exports = { register, login, forgotPassword, verifyResetCode, resetPassword };
