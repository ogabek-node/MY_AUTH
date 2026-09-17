require("dotenv").config();

const { connectDB } = require("./db/index");
const app = require("./app");

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log("server ishladi");
    console.log(`http://localhost:${PORT}/api-docs`);
});