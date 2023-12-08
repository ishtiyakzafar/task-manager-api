const mongoose = require("mongoose");

const attendanceModel = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    check_in: { type: Date, default: null },
    check_out: { type: Date, default: null },
    state: { type: String, default: '0', enum: ['0', '1', '2'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceModel);

