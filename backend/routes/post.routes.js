import express from 'express'
import { isLogedin } from '../middleware/isLogedIn.middleware.js';
import { createPost, getPost, getPosts, updatePost, deletePost,
    getFollowingPosts, likeDislikePost, addBookMarkPost
 } from '../controller/post.controller.js';
import upload from '../middleware/multer.js';


const router = express.Router();


router.post('/', isLogedin, upload.single('image'), createPost)
router.get('/all-posts', getPosts)
router.get('/following-posts', isLogedin, getFollowingPosts)
router.get('/:id', isLogedin, getPost)
router.patch('/:id', isLogedin, updatePost)
router.delete('/:id', isLogedin, deletePost)
router.get('/:id/like-dislike', isLogedin, likeDislikePost)
router.get('/:id/add-bookmark', isLogedin, addBookMarkPost)


export default router