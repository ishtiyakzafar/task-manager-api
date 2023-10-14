const mongoose = require("mongoose");

const invitationModel = new mongoose.Schema(
    {
        workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true, },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
        status: { type: String, required: true, default: 'pending', enum: ['accepted', 'pending', 'rejected'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Invitation", invitationModel);

