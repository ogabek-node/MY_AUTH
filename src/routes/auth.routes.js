const express=require("express");

const routes=express.Router();

const {register,login}=require("../controller/auth.controller");
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yangi user ro'yxatdan o'tkazish
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tdi
 *       409:
 *         description: Email oldin ro'yxatdan o'tgan
 *       500:
 *         description: Serverda xatolik
 */
routes.post("/register",register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login muvaffaqiyatli
 *       401:
 *         description: Email yoki password xato
 *       500:
 *         description: Serverda xatolik
 */
routes.post("/login",login);

module.exports=routes