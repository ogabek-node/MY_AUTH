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
        await pool.connect(); 
        console.log("Database muvaffaqiyatli ulandi");
    } catch (error) {
        console.error("Database ulanishda xatolik yuz berdi:", error);
    }
};

module.exports={pool,connectDB};
