const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    kitName: {
        type: String,
        required: true,
        unique: true   // each sensor kit name should be unique
    },
    mobileNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Device", deviceSchema);
