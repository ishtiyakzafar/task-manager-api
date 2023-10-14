const mongoose = require("mongoose");

const postModel = new mongoose.Schema(
    {
        postedBy: { type: String, required: true, enum: ['student', 'teacher'] },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true, },
        postTitle: { type: String, required: true, trim: true },
        comments: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
            comment: { type: String, required: true, trim: true },
            updatedAt: { type: Date, },
        }],
        media: {
            url: { type: String },
            type: { type: String },
            name: { type: String }
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postModel);

