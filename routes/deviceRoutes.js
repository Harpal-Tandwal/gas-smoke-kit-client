const express = require("express");
const axios = require("axios");
const Device = require("../models/Device");

const router = express.Router();
const { sendSMS } = require("../services/smsService");

/*
ROUTE 1:
Register ESP32 with Kit Name and Mobile Number
POST /api/register-device
Body:
{
  "serialNumber": "ESP32_ABC123",
  "kitName": "Kitchen Gas Sensor",
  "mobileNumber": "8178385290"
}
*/
router.post("/register-device", async (req, res) => {
    try {
        const { serialNumber, kitName, mobileNumber } = req.body;

        if (!serialNumber || !kitName || !mobileNumber) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const device = await Device.findOneAndUpdate(
            { serialNumber },
            { kitName, mobileNumber },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: "Device registered successfully",
            data: device
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/*
ROUTE 2:
Receive alert from ESP32 and send SMS
POST /api/alert
Body:
{
  "serialNumber": "ESP32_ABC123",
  "gasLevel": 650,
  "type": "GAS"   // GAS or SMOKE
}
*/
router.post("/alert", async (req, res) => {
    try {
        const { serialNumber, gasLevel, type } = req.body;

        const device = await Device.findOne({ serialNumber });

        if (!device) {
            return res.status(404).json({ message: "Device not registered" });
        }

        const { mobileNumber, kitName } = device;

        const message = `🚨 ALERT!
Kit: ${kitName}
Device: ${serialNumber}
Type: ${type}
Level: ${gasLevel}`;

        // ---- SMS API PLACEHOLDER ----
         const smsResponse = await sendSMS(mobileNumber, message);

      
        console.log("Sending SMS to:", mobileNumber);
        console.log("Message:", message);

        /*
        Example for Fast2SMS:
        await axios.post("https://www.fast2sms.com/dev/bulkV2", {
            route: "v3",
            message: message,
            sender_id: "TXTIND",
            language: "english",
            numbers: mobileNumber
        }, {
            headers: {
                authorization: process.env.FAST2SMS_API_KEY
            }
        });
        */

        res.json({
            success: true,
            message: "Alert processed and SMS sent",
            smsResponse
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
