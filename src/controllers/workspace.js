const Workspace = require("../model/workspace");
const Post = require("../model/post");
const User = require("../model/user");

//CREATE WORKSPACE
exports.createWorkspace = async (req, res) => {
  try {
    const newClass = new Workspace({ ...req.body, teacherId: req.user._id });
    await newClass.save();
    return res.status(201).json({ message: "Class created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//GET TEACHER WORKSPACE BY TEACHER ID/STUDENT ID
exports.getClassList = async (req, res) => {
  try {
    if (req.user.role === "teacher") {
      const classlist = await Workspace.find({
        teacherId: req.user._id,
      });

      return res.status(200).json(classlist);
    } else {
      const classlist = await Workspace.find({
        invitedStudent: {
          $elemMatch: { status: "accepted", studentId: req.user._id },
        },
      }).populate("teacherId", "fullName image");

      return res.status(200).json(classlist);
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//GET WORKSPACE BY ID
exports.getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate(
        "invitedStudent.studentId",
        "currentWorkspaceId status socketId fullName email role createdAt updatedAt image"
      )
      .populate(
        "teacherId",
        "currentWorkspaceId status socketId fullName email role createdAt updatedAt image"
      );

    return res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//DELETE WORKSPACE
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ workspaceId: workspace._id });

    return res
      .status(200)
      .json({ message: "workspace deleted successfully", workspace });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//UPDATE WORKSPACE
exports.updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndUpdate(req.body.workspaceId, {
      ...req.body,
    });
    return res
      .status(200)
      .json({ message: "workspace deleted successfully", workspace });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};
