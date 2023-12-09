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

exports.userAttendance = async (req, res) => {
  const { fromDate, toDate } = req.body;

  try {
    const result = await Attendance.find({
      userId: req.user._id,
      $or: [
        { state: 2 },
        { state: 1 },
        { state: 0 },
      ],
      createdAt: {
        "$gte": moment(new Date(fromDate)).utc().startOf('day').toDate(),
        "$lte": moment(new Date(toDate)).utc().endOf('day').toDate(),
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};