const {Pool}=require("pg");
require("dotenv").config()

const pool= new Pool({
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

const connectDB=async()=>{
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
                reset_code_hash TEXT,
                reset_code_expires_at TIMESTAMP,
                reset_code_verified_at TIMESTAMP
            )
        `);
        await pool.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'
        `);
        await pool.query(`
            UPDATE users SET role='user' WHERE role IS NULL
        `);
        await seedAdmin();
        console.log("Database muvaffaqiyatli ulandi");
    } catch (error) {
        console.error("Database ulanishda xatolik yuz berdi:", error);
    }
};

const seedAdmin = async () => {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.warn("ADMIN_EMAIL va ADMIN_PASSWORD berilmagan; admin seed qilinmadi");
        return;
    }

    const bcrypt = require("bcrypt");
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
        `INSERT INTO users (username, email, password, role)
         VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (email) DO UPDATE SET role='admin'`,
        ["Admin", ADMIN_EMAIL, passwordHash]
    );
};

module.exports={pool,connectDB};
