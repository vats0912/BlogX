const mongoose = require('mongoose');

function connectMONGODB(server) {
    return mongoose.connect(server, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

module.exports = connectMONGODB;
