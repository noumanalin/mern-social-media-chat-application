import mongoose from 'mongoose';
import userModel from '../model/user.model.js'



// ---------------- Helper Functions -------------------------

// ---------------- Controller Functions -------------------------

// =============== 1. Get User Profile By ID ============================================================
export const getUserProfileByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password -bookmarks -loginHistory");

    if (!user) {
      return res.status(404).json({ success: false, message: "No user found with that ID" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};


// =============== 2. Get Segisted Users ============================================================
export const getSegistedUsers = async (re, res, next) => {
    try {
        
    } catch (error) {
        next(error) 
    }
}

// =============== 3. Edit Profile ============================================================
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


// =============== 4. Follow | Unfollow User  ============================================================
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

// =============== 5. Upload User DP  ============================================================
export const updateUserDisplayPicture = async (re, res, next) => {
    try {
        
    } catch (error) {
        next(error)   
    }
}


















// ============================= 6. GET USER POSTS ================================================
//  GET: api/users/:id/posts
// 
export const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.id;
        const posts = await userModel.findById(userId).populate({path:"posts", options:{sort:{createdAt:-1}}})

        res.status(200).json({success:true, posts, message:"user posts"})
    } catch (error) {
        next(error)
    }
}

















// ============================= 7. GET BOOKMARKS POSTS ================================================
//  GET: /v1/user/bookmarks
// PROTECTED
export const getUserBookMarks = async (req, res, next) => {
    try {
        const userId = req.params.id; 
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const user = await userModel.findById(userId)
            .populate({
                path: "bookmarks",
                populate: {
                    path: "creator",
                    select: "userName _id profilePhoto"
                },
                options: { sort: { createdAt: -1 } }
            });
            
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            bookmarks: user.bookmarks,
            message: "User bookmarked posts retrieved successfully"
        });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        next(error);
    }
}
