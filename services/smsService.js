const axios = require("axios");

async function sendSMS(mobileNumber, message) {
    try {
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "q",
                message: message,
                language: "english",
                numbers: mobileNumber
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Fast2SMS Error:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = { sendSMS };
