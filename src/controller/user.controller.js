const { pool } = require("../db");
const bcrypt = require("bcrypt");

const userFields = "id, username, email, role";

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT ${userFields} FROM users ORDER BY id`);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Foydalanuvchilarni olishda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const getUser = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ${userFields} FROM users WHERE id=$1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Foydalanuvchini olishda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING ${userFields}`,
            [username, email, passwordHash]
        );
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email oldin ro'yxatdan o'tgan" });
        }
        console.error("Foydalanuvchi qo'shishda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const values = [username, email];
        let passwordClause = "";

        if (password) {
            values.push(await bcrypt.hash(password, 10));
            passwordClause = `, password=$${values.length}`;
        }

        values.push(req.params.id);
        const result = await pool.query(
            `UPDATE users
             SET username=$1, email=$2${passwordClause}
             WHERE id=$${values.length}
             RETURNING ${userFields}`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email oldin ro'yxatdan o'tgan" });
        }
        console.error("Foydalanuvchini yangilashda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM users WHERE id=$1 RETURNING id",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
        }
        return res.status(204).send();
    } catch (error) {
        console.error("Foydalanuvchini o'chirishda xatolik:", error);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
