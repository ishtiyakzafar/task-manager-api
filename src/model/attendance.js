const mongoose = require("mongoose");

const attendanceModel = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
    checkinTime: { type: Date, default: null },
    checkoutTime: { type: Date, default: null },
    state: { type: String, default: 'check-in', enum: ["check-in", "check-out", "absent"] },
  }
);

module.exports = mongoose.model("Attendance", attendanceModel);

