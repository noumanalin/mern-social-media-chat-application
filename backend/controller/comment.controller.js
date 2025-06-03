import CommentModel from "../model/comment.model.js";
import UserModel from "../model/user.model.js";
import PostModel from "../model/post.model.js";


// ============================= 1. CREATE COMMENT ================================================
//  POST: api/comment/:id
// PROTECTED

export const createComment = async (req, res, next) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ success: false, message: "You can't post an empty comment" });
        }

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not available where you want to comment" });
        }

        let newComment = await CommentModel.create({
            text: comment,
            author: userId,
            post: postId
        });

        newComment = await newComment.populate("author", "username profilePhoto");

        await PostModel.findByIdAndUpdate(postId, { $push: { comments: newComment._id } }, { new: true });

        res.status(201).json({ success: true, newComment, message: "Comment added successfully 🎉" });

    } catch (error) {
        next(error);
    }
};


// ============================= 2. GET COMMENTS ================================================
//  GET: api/comment/:id
export const getPostComments = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const comments = await CommentModel.find({ post: postId })
            .populate("author", "username profilePhoto")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, comments });

    } catch (error) {
        next(error);
    }
};

// ============================= 3. DELETE COMMENTS ================================================
//  DELETE: api/comment/:id
export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const userId = req.id;

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "The comment you are trying to delete is not available or already deleted." });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "🙏 Please not try to delete other user comments, it's not authorize." });
        }

        await PostModel.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

        const deletedComment = await CommentModel.findByIdAndDelete(commentId);

        res.status(200).json({ success: true, deletedComment, message: "Comment deleted successfully ✅" });

    } catch (error) {
        next(error);
    }
};
