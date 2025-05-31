import CommentModel  from "../model/comment.model";
import UserModel from "../model/user.model.js";
import PostModel from "../model/post.model.js";

// ============================= 1. CREATE COMMENT ================================================
//  POST: api/comment
// PROTECTED

export const createComment = async (req, resizeBy, next)=>{
    try {
        const userId = req.id;
        const postId = req.params.id
        const {comment} = req.body;
        if(!comment) {
            return res.status(404).json({success:false, message:"you can't post a empty comment"})
        }

        const post = await PostModel.findById(postId);
        if(!post){
            return res.status(404).json({success:false, message:"Post not avilable where you want to comment"})
        }

        const newComment = await CommentModel.create({
            text: comment,
            author: userId,
            post: postId
        })

        newComment.populate({
            path:"author",
            select:"username profilePhoto"
        })

        // await post.comments.push(newComment._id)
        // post.save();
        // or
        await PostModel.findByIdAndUpdate(postId, {$push: {comments: newComment?._id}}, {new: true});

        res.status(201).json({success:true, newComment, message:"Comment added successfully 🎉"})
        
    } catch (error) {
        next(error)
    }
}