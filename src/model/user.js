const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
    {
        status: { type: Boolean, default: true },
        fullName: { type: String, required: true, trim: true },
        mobile: { type: String, trim: true },
        dob: { type: Date},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ['admin', 'user'] },
        image: { type: String },
        accountVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userModel);

