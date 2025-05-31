import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true, maxlength: [1000, 'Comment cannot exceed 1000 characters'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment
