
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    brand: String,
    model: String,
    quantity: {
        type: Number,
        default: 1,
        min: 0
    },
    status: String,
    purchaseDate: Date,
    description: String
});

module.exports = mongoose.model("Device", deviceSchema);
