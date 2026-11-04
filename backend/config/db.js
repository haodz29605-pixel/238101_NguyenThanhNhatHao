const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
            throw new Error("MONGO_URI không đúng định dạng!");
        }

        await mongoose.connect(uri, {
            dbName: "238101_NguyenThanhNhatHao"
        });

        console.log("MongoDB Atlas connected successfully!");

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;