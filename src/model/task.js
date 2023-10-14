const mongoose = require("mongoose");

const taskModel = new mongoose.Schema(
    {
        project_name: { type: String, required: true, trim: true },
        task_category: { type: String, required: true, trim: true },
        task_start_date: { type: String, required: true },
        task_end_date: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        comments: [{
            comment: { type: String, trim: true },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: String, default: new Date() },
        }],
        state: { type: String, default: 'New', enum: ['New', 'In-Progress', 'Review', 'Done'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskModel);

