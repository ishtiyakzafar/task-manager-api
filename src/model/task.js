const mongoose = require("mongoose");

const taskModel = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true, trim: true },
        project_name: { type: String, required: true, trim: true },
        comments: [{
            comment: { type: String, trim: true },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: Date },
        }],
        state: { type: Boolean, default: false },
        eod_date: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskModel);

