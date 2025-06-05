import UserModel from "../model/user.model.js";
import PostModel from "../model/post.model.js";
import CommentModel from "../model/comment.model.js";
import sharp from "sharp";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

// ============================= 1. CREATE POST ================================================
//  POST: api/post/
// PROTECTED
export const createPost = async (req, res, next) => {
    try {
        const userId = req.id;
        const { body } = req.body;
        const image = req.file;

        // Validation
        if (!body || !image) {
            return res.status(400).json({
                success: false,
                message: "Please provide both text content and an image"
            });
        }

        // Validate image size (2MB max)
        if (image.size > 2 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "Image size should be less than 2MB"
            });
        }

        // Optimize image with Sharp
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize(800, 800, {  // Resize to max 800x800
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .jpeg({ 
                quality: 80,  // Reduce quality to 80%
                progressive: true 
            })
            .toBuffer();

        // Upload to Cloudinary
        const cloudinaryResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: "social-media/posts",
                    public_id: `${userId}_${Date.now()}`,
                    overwrite: true
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(optimizedImageBuffer);
        });

        // Create new post
        const newPost = await PostModel.create({
            creator: userId,
            body,
            image: cloudinaryResult.secure_url,
            likes: [],
            comments: []
        });

        // Update user's posts array
        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { posts: newPost._id } },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        next(error);
    }
};












// ============================= 2. GET POST ================================================
//  GET: api/post/:id
// PROTECTED
export const getPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await PostModel.findById(id)
            .populate("creator")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "userName _id profilePhoto"
                },
                options: { sort: { createdAt: -1 } }
            });

        res.status(200).json({success: true, post});
    } catch (error) {
        console.log(`getPost Error:: ${error}`);
        next(error);
    }
}















// ============================= 3. GET POSTS ================================================
//  GET: api/post/all-posts
// PROTECTED
export const getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "creator",
        select: "userName profilePhoto",
        model: "User" 
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "userName _id profilePhoto",
          model: "User"
        }
      });

    console.log('Found posts:', posts.length); // Debug logging
    console.log("Sample post creator:", posts[0].creator);
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Error in getPosts:', error);
    next(error);
  }
};
















// ============================= 4. UPDATE POST ================================================
//  PATCH: api/post/:id
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
        
        // Find the post with comments populated
        const post = await PostModel.findById(postId).populate('comments');
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "❌ The post you tried to delete is not available"
            });
        }

        // Check ownership
        if (post.creator.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "❌ You can't delete other user's post"
            });
        }

        // 1. Delete image from Cloudinary if it exists
        if (post.image) {
            try {
                const imageUrl = post.image;
                const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
                
                await new Promise((resolve, reject) => {
                    cloudinary.uploader.destroy(publicId, (error, result) => {
                        if (error) {
                            console.error('Cloudinary deletion error:', error);
                            reject(error);
                        } else {
                            console.log(`Deleted image from Cloudinary: ${publicId}`);
                            resolve(result);
                        }
                    });
                });
            } catch (cloudinaryError) {
                console.error('Failed to delete Cloudinary image:', cloudinaryError);
                // Continue with post deletion even if image deletion fails
            }
        }

        // 2. Delete all associated comments
        if (post.comments && post.comments.length > 0) {
            try {
                await CommentModel.deleteMany({ 
                    _id: { $in: post.comments } 
                });
                
                // Remove these comments from users' comments arrays
                await UserModel.updateMany(
                    { comments: { $in: post.comments } },
                    { $pull: { comments: { $in: post.comments } } }
                );
            } catch (commentsError) {
                console.error('Failed to delete comments:', commentsError);
                // Continue with post deletion even if comments deletion fails
            }
        }

        // 3. Delete the post
        const deletedPost = await PostModel.findByIdAndDelete(postId);

        // 4. Remove post from creator's posts array
        await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { posts: postId } },
            { new: true }
        );

        // 5. Remove post from bookmarks of all users
        await UserModel.updateMany(
            { bookmarks: postId },
            { $pull: { bookmarks: postId } }
        );

        // 6. Remove post from likes of all users
        await UserModel.updateMany(
            { likedPosts: postId },
            { $pull: { likedPosts: postId } }
        );

        res.status(200).json({
            success: true,
            message: "Post and all associated data deleted successfully",
            post: deletedPost
        });

    } catch (error) {
        console.error('Error in deletePost:', error);
        next(error);
    }
};















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
//  PUT: api/post/like-dislike/:id
// PROTECTED
export const likeDislikePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        let updatePost;
        if (post.likes.includes(userId)) {
            updatePost = await PostModel.findByIdAndUpdate(
                postId,
                { $pull: { likes: userId } },
                { new: true }
            ).populate('likes', 'name image'); // Populate if needed
        } else {
            updatePost = await PostModel.findByIdAndUpdate(
                postId,
                { $push: { likes: userId } },
                { new: true }
            ).populate('likes', 'name image');
        }

        return res.status(200).json({
            success: true,
            message: post.likes.includes(userId) ? "Post unliked" : "Post liked",
            updatePost
        });
    } catch (error) {
        next(error);
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
