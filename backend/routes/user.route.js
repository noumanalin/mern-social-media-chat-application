import express from 'express'
import { editProfile, followUnFollowUser, getSegistedUsers, getUserProfileByID, updateUserDisplayPicture, getUserPosts, getUserBookMarks } from '../controller/user.controller.js';
import { isLogedin } from '../middleware/isLogedIn.middleware.js';
import upload from '../middleware/multer.js';


const router = express.Router();


router.get('/users',isLogedin, getSegistedUsers)
router.get('/:id',   getUserProfileByID)
router.patch('/:id', isLogedin, editProfile)
router.get('/follow-unfollow/:id', isLogedin, followUnFollowUser)
router.post('/upload/user-dp', isLogedin, upload.single('image'), updateUserDisplayPicture)
router.get('/:id/posts', getUserPosts)
router.get('/:id/bookmarks', isLogedin, getUserBookMarks)


export default router;