const mongoose = require("mongoose");

const classroomModel = new mongoose.Schema(
    {
        workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
        status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Classroom", classroomModel);

