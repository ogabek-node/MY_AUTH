const express = require("express");
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require("../controller/user.controller");
const {
    createUserSchema,
    updateUserSchema,
} = require("../validation/user.validation");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

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
 * /api/users:
 *   get:
 *     summary: Barcha foydalanuvchilarni olish
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Bitta foydalanuvchini olish
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumotlari
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.get("/:id", getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yangi foydalanuvchi qo'shish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       201:
 *         description: Foydalanuvchi yaratildi
 *       409:
 *         description: Email oldin ro'yxatdan o'tgan
 */
router.post("/", authenticate, requireAdmin, validate(createUserSchema), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Foydalanuvchini yangilash
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: Foydalanuvchi yangilandi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.put("/:id", validate(updateUserSchema), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Foydalanuvchini o'chirish
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Foydalanuvchi o'chirildi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.delete("/:id", deleteUser);

module.exports = router;
