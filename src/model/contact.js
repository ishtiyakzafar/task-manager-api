const mongoose = require("mongoose");

const contactModel = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        chatId: { type: String },
        isGroupContact: { type: Boolean, default: false },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        contactName: { type: String },
        groupName: { type: String },
        user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
        groupImage: { type: String },
        aboutGroup: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactModel);

