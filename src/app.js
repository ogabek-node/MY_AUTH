require("dotenv").config()
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const swaggerSpec = require("./swagger/swagger");

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;