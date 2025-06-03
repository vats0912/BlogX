const mongoose=require('mongoose')

function connectMONGODB(server){
    return mongoose.connect(server)
}

module.exports=connectMONGODB