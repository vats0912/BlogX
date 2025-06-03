const mongoose = require('mongoose')
const { error } = require('node:console')
const { createHmac, randomBytes } = require('node:crypto')
const { generateToken, validateToken } = require('../service/auth')
const crypto=require('crypto')
const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        salt: {
            type: String,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: "USER"
        },

        profilepic: {
            type: String
        },

    }, { timestamps: true }
)

userSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password'))
    return next()
try{
    const salt = randomBytes(16).toString("hex")
    const hashedPassword = crypto.createHmac('sha256', salt)
        .update(user.password)
        .digest('hex')
    this.salt = salt
    this.password = hashedPassword
    next()
}catch(err){
     next(err)
}
})

userSchema.static("matchPasswordandGenerateToken", async function (email, password) {
    if(!email || !password){
        throw new Error("No Email or Password")
    }
    const user = await this.findOne({ email })
    if (!user) throw new Error("USER NOT FOUND")
    const userSalt = user.salt
    const hashPassword = user.password
    const userProvidedHash = crypto.createHmac('sha256', userSalt)
        .update(password)
        .digest('hex')

        if(userProvidedHash.length!=hashPassword.length){
            throw new Error('Incorrect Password')
        }

    if (!crypto.timingSafeEqual(Buffer.from(userProvidedHash), Buffer.from(hashPassword))) {
            throw new Error("INCORRECT PASSWORD");
        }
   
        const token = generateToken(user)
        return token


})

const User = mongoose.model('User', userSchema)
module.exports = User