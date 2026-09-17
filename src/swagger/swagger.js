const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.3",
        info: {
            title: "MY_AUTH API",
            version: "1.0.0",
            description: "Autentifikatsiya va parolni email orqali tiklash API",
        },
        servers: [{ url: "/" }],
        tags: [
            { name: "Auth", description: "Autentifikatsiya endpointlari" },
            { name: "Users", description: "Foydalanuvchilarni boshqarish endpointlari" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                EmailRequest: {
                    type: "object",
                    required: ["email"],
                    properties: { email: { type: "string", format: "email", example: "user@example.com" } },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["fullname", "email", "password"],
                    properties: {
                        fullname: { type: "string", example: "Ali Valiyev" },
                        email: { type: "string", format: "email", example: "user@example.com" },
                        password: { type: "string", format: "password", example: "Strong@123" },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string", format: "password" },
                    },
                },
                ResetCodeRequest: {
                    type: "object",
                    required: ["email", "code"],
                    properties: {
                        email: { type: "string", format: "email" },
                        code: { type: "string", pattern: "^\\d{6}$", example: "123456" },
                    },
                },
                ResetPasswordRequest: {
                    type: "object",
                    required: ["email", "code", "newPassword"],
                    properties: {
                        email: { type: "string", format: "email" },
                        code: { type: "string", pattern: "^\\d{6}$", example: "123456" },
                        newPassword: { type: "string", format: "password", example: "NewStrong@123" },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        username: { type: "string", example: "Ali Valiyev" },
                        email: { type: "string", format: "email", example: "user@example.com" },
                        role: { type: "string", enum: ["user", "admin"], example: "user" },
                    },
                },
                UserRequest: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: { type: "string", example: "Ali Valiyev" },
                        email: { type: "string", format: "email", example: "user@example.com" },
                        password: { type: "string", format: "password", example: "Strong@123" },
                    },
                },
                UserUpdateRequest: {
                    type: "object",
                    required: ["username", "email"],
                    properties: {
                        username: { type: "string", example: "Ali Valiyev" },
                        email: { type: "string", format: "email", example: "user@example.com" },
                        password: { type: "string", format: "password", example: "NewStrong@123" },
                    },
                },
            },
        },
    },
    apis: [path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")],
});

module.exports = swaggerSpec;