const Task = require("../model/task");
const Project = require("../model/project");

const moment = require('moment');



// CREATE NEW TASK
exports.createTask = async (req, res) => {
    try {
        const newTask = new Task({
            userId: req.user._id,
            title: req.body.title,
            project_name: req.body.project_name,
        });
        const result = await newTask.save();
        return res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

// GET TASK HISTORY LIST
exports.taskHistory = async (req, res) => {
    const { fromDate, toDate, projectName } = req.body;

    let payload = {
        userId: req.user._id,
        createdAt: {
            "$lt": moment().startOf('day').toDate(),
        }
    }

    if (fromDate && toDate) {
        payload.createdAt = {
            "$gte": moment(new Date(fromDate)).utc().startOf('day').toDate(),
            "$lte": moment(new Date(toDate)).utc().endOf('day').toDate(),
        }
    }

    if (projectName) payload.project_name = projectName;

    try {
        const result = await Task.find(payload).populate("comments.userId", "fullName email");
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

exports.todaySod = async (req, res) => {
    try {
        const result = await Task.find({
            userId: req.user._id,
            $or: [
                { createdAt: req.body.createdAt },
                { state: false },
            ]
        }).populate("comments.userId", "fullName email");
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
    // const { state, comment, id } = req.body;
    // let data;
    // if (comment) {
    //     data = {
    //         state,
    //         $push: {
    //             comments: {
    //                 $each: [{
    //                     userId: req.user._id,
    //                     comment,
    //                 }],
    //                 $position: 0
    //             }
    //         }
    //     }
    // } else {
    //     data = {
    //         state,
    //     }
    // }

    try {
        const result = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


exports.updateTaskState = async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).json({ message: "Your task state updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Your work item has been deleted." });
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};


exports.filterTask = async (req, res) => {
    try {
        const { search } = req.query;

        const filterQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { project_name: { $regex: search, $options: "i" } },
                { task_category: { $regex: search, $options: "i" } },
            ]
        };

        const result = await Task.find(filterQuery)
            .populate('userId', 'fullName email')
            .populate("comments.userId", "fullName email")
            .sort({ updatedAt: -1 })
            .exec();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};


exports.addComment = async (req, res) => {
    try {
        const result = await Task.findByIdAndUpdate(
            req.body._id,
            {
                $push: {
                    comments: {
                        userId: req.user._id,
                        comment: req.body.comment,
                        createdAt: req.body.createdAt,
                    },
                },
            },
            { new: true }).populate("comments.userId", "fullName email");
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};



exports.deleteComment = async (req, res) => {
    try {
        await Task.updateOne(
            { _id: req.body.taskId, "comments._id": req.body.commentId },
            { $pull: { comments: { _id: req.body.commentId } } },
            { new: true }
        );
        res.status(200).json({ message: "Your comment has been deleted." });
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};




// GET ALL TASK 
exports.getAllTasks = async (req, res) => {
    const { fromDate, toDate, project_name, userId } = req.body;

    let payload = {};

    if (fromDate && toDate) {
        payload.createdAt = {
            "$gte": moment(new Date(fromDate)).utc().startOf('day').toDate(),
            "$lte": moment(new Date(toDate)).utc().endOf('day').toDate(),
        }
    }
    if (project_name) payload.project_name = project_name;
    if (userId) payload.userId = userId;


    try {
        let result;
        if (fromDate || toDate || project_name || userId) {
            result = await Task.find(payload)
                .populate("userId", "fullName")
                .populate("comments.userId", "fullName email");
        } else {
            result = []
        }
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


exports.adminAddTask = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        return res.status(201).json({ message: "Task created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

exports.addProjectName = async (req, res) => {
    try {
        const newTask = new Project(req.body);
        const result = await newTask.save();
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};


exports.getProjects = async (req, res) => {
    try {
        const result = await Project.find({}).sort({ createdAt: -1 });
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Project has been deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const result = await Project.findByIdAndUpdate(req.body.id, req.body, { new: true });
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};

