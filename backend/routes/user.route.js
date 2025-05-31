import express from 'express'
import { editProfile, followUnFollowUser, getSegistedUsers, getUserProfileByID, updateUserDisplayPicture, getUserPosts, getUserBookMarks } from '../controller/user.controller.js';
import { isLogedin } from '../middleware/isLogedIn.middleware.js';


const router = express.Router();


router.get('/:id',   getUserProfileByID)
router.get('/users', getSegistedUsers)
router.patch('/:id', isLogedin, editProfile)
router.get('/follow-unfollow/:id', isLogedin, followUnFollowUser)
router.post('/upload/user-dp', isLogedin, updateUserDisplayPicture)
router.get('/:id/posts', getUserPosts)
router.get('/user-bookmarks', isLogedin, getUserBookMarks)


export default router;