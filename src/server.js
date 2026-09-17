const express=require("express");
const { connectDB } = require("./db/index");

connectDB()
const app=require("./app");
const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("server ishladi");
})
