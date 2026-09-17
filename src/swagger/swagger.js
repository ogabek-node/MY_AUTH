const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Auth API",
            version: "1.0.0",
            description: "Register va Login API"
        },

        servers: [
            {
                url: "http://localhost:3001"
            }
        ],

        components: {
            schemas: {
                Register: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: {
                            type: "string",
                            example: "Ogabek"
                        },
                        email: {
                            type: "string",
                            example: "ogabek@gmail.com"
                        },
                        password: {
                            type: "string",
                            example: "12345678"
                        }
                    }
                },

                Login: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            example: "ogabek@gmail.com"
                        },
                        password: {
                            type: "string",
                            example: "12345678"
                        }
                    }
                }
            }
        }
    },

    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;