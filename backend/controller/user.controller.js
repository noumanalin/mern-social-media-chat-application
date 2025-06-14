import mongoose from 'mongoose';
import userModel from '../model/user.model.js';
import cloudinary from '../lib/cloudinary.js';

// ---------------- Controller Functions -------------------------

// =============== 1. Get User Profile By ID ======================================================
export const getUserProfileByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "No user found with that ID" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// =============== 2. Get Registered Users ========================================================
export const getSegistedUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({})
      .select("userName profilePhoto bio followers followings")
      .sort({ registeredAt: -1 })
      .limit(20); // Limit to 20 recent users

    res.status(200).json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    next(error);
  }
};

// =============== 3. Edit Profile ================================================================
export const editProfile = async (req, res, next) => {
  try {
    const { userName, bio } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.id,
      { userName, bio },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// =============== 4. Follow | Unfollow User ======================================================
export const followUnFollowUser = async (req, res, next) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ success: false, message: "You cannot follow/unfollow yourself" });
    }

    const user = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFollowing = user.followings.includes(targetUserId);

    if (isFollowing) {
      await Promise.all([
        userModel.updateOne({ _id: currentUserId }, { $pull: { followings: targetUserId } }),
        userModel.updateOne({ _id: targetUserId }, { $pull: { followers: currentUserId } }),
      ]);
      return res.status(200).json({ success: true, message: 'Unfollowed successfully' });
    } else {
      await Promise.all([
        userModel.updateOne({ _id: currentUserId }, { $push: { followings: targetUserId } }),
        userModel.updateOne({ _id: targetUserId }, { $push: { followers: currentUserId } }),
      ]);
      return res.status(200).json({ success: true, message: 'Followed successfully' });
    }

  } catch (error) {
    next(error);
  }
};

// =============== 5. Upload User Display Picture =================================================
export const updateUserDisplayPicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    const user = await userModel.findById(req.id);
    
    // Delete old image from Cloudinary if exists
    if (user.profilePhoto) {
      const publicId = user.profilePhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`beta-communes/user-dp/${publicId}`);
    }

    // Upload new image to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "beta-communes/user-dp",
      public_id: `${req.id}_${Date.now()}`,
      resource_type: "image"
    });

    // Update user profile photo
    const updatedUser = await userModel.findByIdAndUpdate(
      req.id,
      { profilePhoto: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// =============== 6. Get User Posts ==============================================================
export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "creator",
        select: "userName profilePhoto"
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      posts: user.posts,
      message: "User posts retrieved successfully"
    });
  } catch (error) {
    next(error);
  }
};

// =============== 7. Get Bookmarks Posts =========================================================
export const getUserBookMarks = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(userId)
      .populate({
        path: "bookmarks",
        populate: [
          {
            path: "creator",
            select: "userName _id profilePhoto"
          },
          {
            path: "comments.user",
            select: "userName profilePhoto"
          }
        ],
        options: { sort: { createdAt: -1 } }
      });
      
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      bookmarks: user.bookmarks,
      message: "Bookmarked posts retrieved successfully"
    });
  } catch (error) {
    next(error);
  }
};