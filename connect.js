const mongoose=require('mongoose')

function connectMONGODB(uri){
    return mongoose.connect(uri)
}

module.exports=connectMONGODB