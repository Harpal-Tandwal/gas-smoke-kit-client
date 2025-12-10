const express = require("express");
const Device = require("../models/Device");
const { sendSMS } = require("../services/smsService");

const router = express.Router();

/*
Register Device
POST /api/register-device
Body:
{
  "serialNumber": "ESP32_001",
  "kitName": "Kitchen Gas Sensor",
  "mobileNumbers": ["8178385290", "9876543210", "9123456789"]
}
*/
router.post("/register-device", async (req, res) => {
    try {
        const { serialNumber, kitName, mobileNumbers } = req.body;

        if (!serialNumber || !kitName || !mobileNumbers) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (!Array.isArray(mobileNumbers) || mobileNumbers.length > 3) {
            return res.status(400).json({
                message: "You can provide up to 3 mobile numbers"
            });
        }

        const device = await Device.findOneAndUpdate(
            { serialNumber },
            { kitName, mobileNumbers },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: "Device registered/updated successfully",
            data: device
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/*
Alert Route
POST /api/alert
Body:
{
  "serialNumber": "ESP32_001",
  "gasLevel": 750,
  "type": "GAS"
}
*/
router.post("/alert", async (req, res) => {
    try {
        const { serialNumber, gasLevel, type } = req.body;

        const device = await Device.findOne({ serialNumber });

        if (!device) {
            return res.status(404).json({ message: "Device not registered" });
        }

        const { kitName, mobileNumbers } = device;

        const message = `🚨 ALERT!
Kit: ${kitName}
Device: ${serialNumber}
Type: ${type}
Level: ${gasLevel}`;

        // ✅ Send SMS to ALL registered numbers
        const results = [];

        for (const number of mobileNumbers) {
            const smsResp = await sendSMS(number, message);
            results.push({ number, status: smsResp });
        }

        res.json({
            success: true,
            message: "Alert sent to all numbers",
            results
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
