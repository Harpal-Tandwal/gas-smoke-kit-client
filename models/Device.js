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
        unique: true
    },
    mobileNumbers: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length >= 1 && arr.length <= 3;
            },
            message: "You can store only 1 to 3 mobile numbers"
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Device", deviceSchema);
