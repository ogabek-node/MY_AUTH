const express=require("express");
const {pool,connectDB}=require("./db/index");

connectDB()
const app=express();
app.use(express.json());
PORT=process.env.PORT

require("./app")

app.listen(PORT,()=>{
    console.log("server ishladi");
})

