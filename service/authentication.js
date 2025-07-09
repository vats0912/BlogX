const USER = require('../models/user');
const {validateToken}=require('./auth')

function checkFortoken(cookievalue){
return async (req,res,next)=>{
   try{
    const tokenValue=req.cookies[cookievalue]
    if(!tokenValue){
      req.user=null
       return next();
    }
   
    const userPayload=validateToken(tokenValue)

    const user=await USER.findById({_id:userPayload._id})
    if(!user){
      console.log("no user")
      req.user=null
      return next()
    }
   
    req.user=user
   
    next()
    } 
    catch(error){
      console.log('Error in checkToken middleware',error)
      req.user=null
    next()
    }
}
}

module.exports=checkFortoken
