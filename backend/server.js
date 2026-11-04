
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Import database và routes
const connectDB = require("./config/db");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// API kiểm tra server
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running"
    });
});

// API quản lý thiết bị
app.use("/api/devices", deviceRoutes);

// Route không tồn tại
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API không tồn tại"
    });
});

// Khởi động server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
