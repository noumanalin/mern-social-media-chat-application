import express from 'express'
import { editProfile, followUnFollowUser, getSegistedUsers, getUserByID, updateUserDisplayPicture } from '../controller/user.controller.js';
import { isLogedin } from '../middleware/isLogedIn.middleware.js';


const router = express.Router();


router.get('/:id',   getUserByID)
router.get('/users', getSegistedUsers)
router.patch('/:id', isLogedin, editProfile)
router.get('/follow-unfollow/:id', isLogedin, followUnFollowUser)
router.post('/upload/user-dp', isLogedin, updateUserDisplayPicture)


export default router;