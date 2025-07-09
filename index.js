const express=require('express')
const app=express()
const path=require('path')
const PORT=process.env.PORT
const connectMONGODB=require('./connect')
const blog=require('./models/blog')
const User=require("./models/user")
const userRouter=require('./routes/user')
const blogRouter=require('./routes/blog')
const cookieParser = require('cookie-parser')
const checkToken=require('./service/authentication')
connectMONGODB(process.env.DATABASE_URL).then(()=>{
    console.log('Server Started and MONGODB connected')
})

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkToken('token'));

app.use('/public',express.static(path.join(__dirname,'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',async (req,res)=>{
    try{
    const allBlogs=await blog.find({}).populate('createdBy', 'fullName');
    const user=req.user
    res.render('home.ejs',{
        user,
        blog:allBlogs,
    })
} catch(error){
    console.error('Error fetching blogs:', error);
    res.status(500).send('Server error');
}
})
app.use('/user',userRouter)
app.use('/blog',blogRouter)
app.listen(PORT,()=>{
    console.log(`Server Started on port:${PORT}`)
})
