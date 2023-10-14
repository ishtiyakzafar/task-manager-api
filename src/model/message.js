const mongoose = require("mongoose");

const messageModel = new mongoose.Schema(
    {
        chatId: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        senderId: { type: String },
        text: { type: String, trim: true },
        media: {
            url: { type: String },
            type: { type: String },
            name: { type: String }
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageModel);

