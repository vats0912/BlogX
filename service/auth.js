const jwt=require('jsonwebtoken')
const secret="your-secret-key"
function generateToken(user){
    const payload={
        fullName:user.fullName,
        _id:user._id,
        email:user.email,
        role:user.role,
        profilepic:user.profilepic,
    }
    const token=jwt.sign(payload,secret,{expiresIn:'1h'})
    return token
}

function validateToken(token){
    const payload=jwt.verify(token,secret)
    return payload
}

module.exports={
    generateToken,validateToken
}