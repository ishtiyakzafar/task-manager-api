const Attendance = require("../model/attendance");
const moment = require('moment');
const CronJob = require('cron').CronJob;
const User = require("../model/user");


exports.createAttendance = async (req, res) => {
  try {

    let result;

    result = await Attendance.findOneAndUpdate(
      {
        userId: req.user._id,
        createdAt: { "$gte": moment().startOf('day').toDate() }
      },
      { ...req.body },
      { new: true }
    )

    if (!result) {
      const newAttendance = new Attendance({ userId: req.user._id, ...req.body });
      result = await newAttendance.save();
    }


    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//get current day attendance
exports.getAttendance = async (req, res) => {
  try {
    const result = await Attendance.findOne({
      userId: req.user._id,
      createdAt: { "$gte": moment().startOf('day').toDate() },
      $or: [
        { state: 'check-in' },
        { state: 'check-out' },
      ],
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
  const { fromDate, toDate, userId } = req.body;

  try {
    const result = await Attendance.find({
      userId,
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


const checkDailyAttendance = async () => {
  try {
    const users = await User.find({ role: "user", accountVerified: true }).select('_id');

    users.map(async (user) => {
      const result = await Attendance.findOne({
        userId: user._id,
        createdAt: { "$gte": moment().startOf('day').toDate() }
      });

      if (!result) {
        const newAttendance = new Attendance({
          userId: user._id,
          state: 'absent',
          createdAt: new Date(),
        });
        await newAttendance.save();
      }
    })

  } catch (error) {
    console.log(error)
  }
}

// Schedule a task to check daily attendance every day at 18:00
const job = new CronJob('0 00 18 * * *', async () => {
  if (new Date().getDay() !== 0) {
    checkDailyAttendance();
  }
}, null, true, 'Asia/Kolkata');

job.start();
