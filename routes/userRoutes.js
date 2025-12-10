const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/*
POST /api/user/register
Body:
{
  "name": "Harpal",
  "contactNumber": "8178385290",
  "password": "mypassword123"
}
*/
router.post("/register", async (req, res) => {
    try {
        const { name, contactNumber, password } = req.body;

        if (!name || !contactNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ contactNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            contactNumber,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            success: true,
            message: "User registered successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
