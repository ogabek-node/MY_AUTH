const pool=require("../db/index");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");


const register= async (req,res) =>{
    try{
        const {username,email,password}=req.body;

        const result = await pool.query("SELECT * FROM users WHERE email=$1",[email]);

        if(result.rows.length>0){
            return res.status(409).json({
                message:"email oldin ro'yxatdan o'tgan"
            })
        }
        
        const hashPassword= await bcrypt.hash(password,10);
      
        const create= await pool.query("INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email",
            [username,email,hashPassword]
        );
       
        

        return res.status(201).json({
            message:"muvaffaqiyatli ro'yxatdan o'tdingiz",
            user:create.rows[0]
        })

    }catch(error){
        console.log(error)
    };
};

const login= async (req,res) =>{
    try{
    const {email,password}=req.body;

  const result= await pool.query("SELECT * FROM users WHERE email=$1",[email],)

  if(result.rows.length===0){
    return res.status(404).json({
        message:"email yoki password xato",
    });
  }
 
  const user= result.rows[0]

 const chekPassword= await bcrypt.compare(
    password,user.password
 );

 if(!chekPassword){
    return res.status(401).json({
        message:"email yoki password xato"
    })
 }
  
 return res.status(200).json({
    message:"login muvaffaqiyatli",
    user:{
        id:user.id,
        username:user.username,
        email:user.email
    }
 });
  

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Serverda xatolik"});
    }
};