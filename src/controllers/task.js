const Task = require("../model/task");

// CREATE NEW TASK
exports.createTask = async (req, res) => {
    try {
        const { project_name, task_category, task_start_date, task_end_date, title, description, comment } = req.body;
        const data = {
            project_name,
            task_category,
            task_start_date,
            task_end_date,
            userId: req.user._id,
            title,
            description,
            comments: comment ? { comment, userId: req.user._id } : []
        }
        const newTask = new Task(data);
        newTask.save(function (err, task) {
            task
                .populate("userId", "fullName")
                .execPopulate()
                .then(function (task) {
                    return res
                        .status(201)
                        .json({ data: task, message: 'Task created successfully' });
                });
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

// GET TASK LIST
exports.taskList = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).populate('userId', 'fullName email').populate("comments.userId", "fullName email").sort({ updatedAt: -1 });
        return res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
    const { state, comment, id } = req.body;
    let data;
    if (comment) {
        data = {
            state,
            $push: {
                comments: {
                    $each: [{
                        userId: req.user._id,
                        comment,
                    }],
                    $position: 0
                }
            }
        }
    } else {
        data = {
            state,
        }
    }

    try {
        const tasks = await Task.findByIdAndUpdate(id, data, { new: true }).populate('userId', 'fullName email').populate("comments.userId", "fullName email");;
        return res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong " + error });
    }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error });
    }
};
