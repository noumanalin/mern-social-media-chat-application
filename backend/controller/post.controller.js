import UserModel from "../model/user.model.js";
import PostModel from "../model/post.model.js";

// import cloudinary from '../utils/cloudinary.config.js
import fs from 'fs';
import path from 'path'


// ============================= 1. CREATE POST ================================================
//  POST: api/post/
// PROTECTED
export const createPost = async (req, res, next) => {
    try {
        const userId = req.id;
        const {body} = req.body;
        
        if(!body){
            return res.status(400).json({success:false, message:"Please fill the text field and choose image"})
        }

        if(!req.file.image){
            return res.status(404).json({success:false})
        } else {
            const {postImage} = req.file
            if(postImage > 100000){
                return res.status().json({success:false, message:"Post picture is too big, it should be less than"})
            }
        }


    } catch (error) {
        next(error)
    }
}













// ============================= 2. GET POST ================================================
//  GET: api/post/:id
// PROTECTED
export const getPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id).populate("creator").populate({
            path:"comments", options:{ sort: {createdAt: -1 }}
        })

        res.status(200).json({success:true, post})
    } catch (error) {
        next(error)
    }
}















// ============================= 3. GET POSTS ================================================
//  GET: api/posts
// PROTECTED
export const getPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1})
        res.status(200).json({success:true, posts})
    } catch (error) {
        next(error)
    }
}















// ============================= 4. UPDATE POSTS ================================================
//  PATCH: api/posts/:id
// PROTECTED
export const updatePost = async (req, res, next) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const { body } = req.body;
        if(!body){
            return res.status(403).json({success:false, message:"❌ Text field of post is empty"})
        }
        const post = await PostModel.findById(postId)
        if(!post){
            return res.status(404).json({success:false, message:"❌ The you try to update is not avilable"})
        }

        if(post?.creator != userId ){
            return res.status(403).json({success:false, message:"❌ You can't update other user's post"})
        }

        const updatePost = await PostModel.findByIdAndUpdate(postId, {body}, {new:true})
        res.status(200).json({success:true, post:updatePost, message:"post updated successfully."})
    } catch (error) {
        next(error)
    }
}















// ============================= 5. DELETE POST ================================================
//  DELETE: api/post/:id
// PROTECTED
export const deletePost = async (req, res, next) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await PostModel.findById(postId)
        if(!post){
            return res.status(404).json({success:false, message:"❌ The you try to delete is not avilable"})
        }

        if(post?.creator != userId ){
            return res.status(403).json({success:false, message:"❌ You can't delete other user's post"})
        }

        const deletePost = await PostModel.findByIdAndDelete(postId);
        // Remove Id of that Post from User's Model, Posts Field
        // await UserModel.findByIdAndUpdate(post?.creator, { $pull: {posts: post?._id }})
        // or
        let user = await UserModel.findById(userId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // Delete comment related to that Post


        res.status(200).json({success:true, message:"Post deleted successfully", post:deletePost})

    } catch (error) {
        next(error)
    }
}















// ============================= 6. GET FOLLOWING POSTS ================================================
//  GET: api/posts/following
// PROTECTED
export const getFollowingPosts = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.id);
        const posts = await PostModel.find({ creator: { $in: user?.following }})
        res.status(200).json({success:true, posts, message:"Post of your following!"})
    } catch (error) {
        next(error)
    }
}















// ============================= 7. LIKE/DISLIKE POST ================================================
//  GET: api/post/like-dislike/:id
// PROTECTED
export const likeDislikePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await PostModel.findById(postId)

        if(post?.likes.includes(userId)){
            updatePost = await PostModel.findByIdAndUpdate(postId, {$pull: {likes: userId}}, {new: true})
            return res.status(200).json({success:true, message:"Post remove from likes", updatePost})
        } else {
            updatePost = await PostModel.findByIdAndUpdate(postId, {$push: {likes: userId}}, {new: true})
            return res.status(200).json({success:true, message:"Post liked", updatePost})

        }
    } catch (error) {
        next(error)
    }
}















// ============================= 8. BOOKMARK POST ================================================
//  GET: api/post/:id/add-bookmark
// PROTECTED
export const addBookMarkPost = async (req, res, next) => {
    try {
        const userId = req.id;
        const postId = req.params.id
        const user = await UserModel.findById(userId)
        const checkPost = await PostModel.findById(postId)
        if(!checkPost){
            return res.statu(400).json({success:false, message:"No such post avilable"})
        }

        const isPostAlreadyBookMarked = user?.bookmarks?.includes(postId)

        if(!isPostAlreadyBookMarked){
            const pushToBookMark = await UserModel.findByIdAndUpdate(userId, {$push: {bookmarks: postId}}, {new:true})
            return res.status(200).json({success:true, bookMark:pushToBookMark, message:"Post bookmarked successfully 🎉"})
        } else {
            const pushToBookMark = await UserModel.findByIdAndUpdate(userId, {$pull: {bookmarks: postId}}, {new:true})
            return res.status(200).json({success:true, bookMark:pushToBookMark, message:"Post remove from bookmarked."})
        }
    } catch (error) {
        next(error)
    }
}
