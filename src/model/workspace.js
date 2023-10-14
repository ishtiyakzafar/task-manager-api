const mongoose = require("mongoose");

const workspaceModel = new mongoose.Schema(
    {
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        className: { type: String, required: true, trim: true },
        section: { type: String, required: true, trim: true },
        subject: { type: String, required: true, trim: true },
        bannerImage: { type: String },
        invitedStudent: [{
            status: { type: String, required: true, default: 'pending', enum: ['accepted', 'pending', 'rejected'] },
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workspace", workspaceModel);

