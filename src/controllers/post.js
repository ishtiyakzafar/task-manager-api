const Post = require("../model/post");

//CREATE POST
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      postedBy: req.user.role,
      userId: req.user._id,
    });

    newPost.save(function (err, post) {
      post
        .populate("userId", "fullName email role")
        .execPopulate()
        .then(function (post) {
          return res
            .status(201)
            .json({ message: "Announcement created successfully!", post });
        });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//ADD COMMENT FOR POST
exports.addComment = async (req, res) => {
  try {
    const { _id, comments } = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          comments: {
            userId: req.user._id,
            comment: req.body.comment,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("comments.userId", "fullName email role image");

    return res
      .status(201)
      .json({ _id, comment: comments[comments.length - 1] });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//GET POST
exports.getPost = async (req, res) => {
  try {
    const posts = await Post.find({ workspaceId: req.params.id })
      .populate("comments.userId", "fullName email role image")
      .populate("userId", "fullName email role image")
      .populate("workspaceId");

    return res.status(200).json(posts.reverse());
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Announcement deleted successfully!", deletedPost });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//UPDATE COMMENT
exports.updateComment = async (req, res) => {
  try {
    await Post.updateOne(
      { _id: req.body.postId, "comments._id": req.body.commentId },
      {
        $set: {
          "comments.$.comment": req.body.updateComment,
          "comments.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: "Comment updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};

//DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {
    await Post.updateOne(
      { _id: req.body.postId, "comments._id": req.body.commentId },
      { $pull: { comments: { _id: req.body.commentId } } },
      { new: true }
    );
    return res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong " + error });
  }
};
