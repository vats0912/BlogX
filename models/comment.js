const {mongoose,Schema}=require('mongoose')
const Blog=require('../models/blog')
const User=require('../models/user')
const commentSchema=new mongoose.Schema({
content:{
    type:String,
    required:true
},

createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},

blogid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Blog"
}

},{timestamps:true})

const Comment=mongoose.model('comment',commentSchema)
module.exports=Comment

