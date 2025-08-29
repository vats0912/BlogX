const express=require('express')
const router=express.Router()
const { error } = require('node:console')
const USER=require('../models/user')
const cookieParser=require("cookie-parser")
const {generateToken}=require('../service/auth')
const Blog = require('../models/blog')

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
 res.clearCookie('token').redirect('/user/signin')
})
   

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if email is already registered
        const existingUser = await USER.findOne({ email });
        if (existingUser) {
            return res.render('signup', {
                error: 'Email already exists. Please sign in or use another email.',
            });
        }

        await USER.create({
            fullName,
            email,
            password,
            profilepic: '/public/avatar.jpg'
        });

        return res.redirect('/user/signin');
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).render('signup', {
            error: 'Something went wrong during signup. Please try again.',
        });
    }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await USER.matchPasswordandGenerateToken(email, password);
    if (!token) {
      return res.render('signin.ejs', { msg: "Incorrect username or password" });
    }
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production'});
    res.redirect('/');
  } catch (err) {
     res.render('signin.ejs', { msg1: "Something went wrong. Please try again." });
  }
});

module.exports=router
