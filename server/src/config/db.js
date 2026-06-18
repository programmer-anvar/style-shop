const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongoDB ishladi: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Xato: ${error.message}`)
    }
}

module.exports = connectDB;