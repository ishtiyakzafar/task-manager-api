const Attendance = require("../model/attendance");
const moment = require('moment');


exports.createAttendance = async (req, res) => {
  try {
    const newAttendance = new Attendance({ userId: req.user._id, ...req.body });
    const result = await newAttendance.save();
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const result = await Attendance.findOne({
      userId: req.user._id,
      createdAt: {
        "$gte": moment().startOf('day').toDate(),
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const result = await Attendance.findByIdAndUpdate(req.body.id, req.body, { new: true });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};