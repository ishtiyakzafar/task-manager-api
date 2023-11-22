const Task = require("../model/task");



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

// GET TASK LIST
exports.taskList = async (req, res) => {
    try {
        const result = await Task.find({
            userId: req.user._id,
            createdAt: req.body.createdAt
            //  {
            // $gte: today.toDate(),
            // $lte: endOfDay.toDate(),
            //     $lt: today.toDate() // Less than the beginning of the current day
            // },
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
        await Task.findByIdAndUpdate(req.body._id, { state: req.body.state }, { new: true });
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

