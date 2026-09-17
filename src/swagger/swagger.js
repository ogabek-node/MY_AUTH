const swaggerSpec = {
    openapi: "3.0.3",
    info: {
        title: "MY_AUTH API",
        version: "1.0.0",
        description: "Autentifikatsiya va parolni email orqali tiklash API",
    },
    servers: [{ url: "/api/auth" }],
    tags: [{ name: "Auth", description: "Autentifikatsiya endpointlari" }],
    paths: {
        "/register": {
            post: {
                tags: ["Auth"],
                summary: "Ro'yxatdan o'tish",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" },
                        },
                    },
                },
                responses: { 201: { description: "Foydalanuvchi yaratildi" }, 400: { description: "Noto'g'ri ma'lumot" } },
            },
        },
        "/login": {
            post: {
                tags: ["Auth"],
                summary: "Tizimga kirish",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                        },
                    },
                },
                responses: { 200: { description: "Muvaffaqiyatli login" }, 401: { description: "Email yoki parol xato" } },
            },
        },
        "/forgot-password": {
            post: {
                tags: ["Auth"],
                summary: "Email orqali tasdiqlash kodi yuborish",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/EmailRequest" },
                        },
                    },
                },
                responses: { 200: { description: "So'rov qabul qilindi" } },
            },
        },
        "/verify-reset-code": {
            post: {
                tags: ["Auth"],
                summary: "Parol tiklash kodini tasdiqlash",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ResetCodeRequest" },
                        },
                    },
                },
                responses: { 200: { description: "Kod tasdiqlandi" }, 400: { description: "Kod noto'g'ri yoki muddati tugagan" } },
            },
        },
        "/reset-password": {
            post: {
                tags: ["Auth"],
                summary: "Yangi parol o'rnatish",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
                        },
                    },
                },
                responses: { 200: { description: "Parol tiklandi" }, 400: { description: "Kod tasdiqlanmagan" } },
            },
        },
    },
    components: {
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
        },
    },
};

module.exports = swaggerSpec;