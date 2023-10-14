const Classroom = require('../model/classroom');
const Invitation = require('../model/invitation');
const User = require('../model/user');
const workspace = require('../model/workspace');


//CREATE CLASSROOM
exports.createClassroom = async (req, res) => {
    try {
        const newClassroom = new Classroom({ workspaceId: req.body.workspaceId, studentId: req.user._id });
        await newClassroom.save();

        await Invitation.findByIdAndUpdate(req.body.inviteId, { status: 'accepted' });

        await workspace.updateOne(
            { _id: req.body.workspaceId, "invitedStudent.studentId": req.user._id },
            { $set: { "invitedStudent.$.status": 'accepted' } },
            { new: true }
        );

        return res.status(201).json({ message: "Classroom created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


//GET CLASSROOM BY STUDENT ID
exports.getClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.find({ studentId: req.user._id }).populate({
            path: 'workspaceId',
            populate: {
                path: 'teacherId', select: 'fullName email'
            }
        });

        return res.status(201).json(classroom);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


//GET CLASSROOM BY ID
exports.getClassroomById = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate({
                path: 'workspaceId',
                populate: {
                    path: 'invitedStudent.studentId', select: 'currentWorkspaceId status socketId fullName email role'
                },
            }).populate({
                path: 'workspaceId',
                populate: {
                    path: 'teacherId', select: 'currentWorkspaceId status socketId fullName email role'
                }
            });

        return res.status(201).json(classroom);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

