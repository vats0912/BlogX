const {mongoose,Schema}=require('mongoose')
const User=require('../models/user')
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    coverImageUrl:{
        type:String,
        required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},
{timestamps:true})

const Blog=mongoose.model('blog',blogSchema)
module.exports=Blog
