const express=require('express')
const router=express.Router()
const { error } = require('node:console')
const USER=require('../models/user')
const cookieParser=require("cookie-parser")
const {generateToken}=require('../service/auth')

router.get('/',(req,res)=>{
    res.render('home')
})
router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.get('/signin',(req,res)=>{
    res.render('signin')
})

router.get('/logout',(req,res)=>{
 res.clearCookie('token').redirect('/')
})
   

router.post('/signup',async (req,res)=>{
const{fullName,email,password}=req.body
await USER.create({
fullName,
email,
password,
profilepic:'/public/avatar.jpg'
})
return res.redirect('/')
})

router.post('/signin',async(req,res)=>{
    const{email,password}=req.body;
    
   const token= await USER.matchPasswordandGenerateToken(email,password)
    if(!token){
        return res.redirect('signin',{
            error:"INCORRECT USERNAME OR PASSWORD",
        })
    }
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/')
})

module.exports=router