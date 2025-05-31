import express from 'express'
import { isLogedin } from '../middleware/isLogedIn.middleware.js';
import { createPost, getPost, getPosts, updatePost, deletePost,
    getFollowingPosts, likeDislikePost, addBookMarkPost
 } from '../controller/post.controller.js';


const router = express.Router();


router.post('/', isLogedin, createPost)
router.get('/:id', isLogedin, getPost)
router.get('/all-posts', isLogedin, getPosts)
router.patch('/:id', isLogedin, updatePost)
router.delete('/:id', isLogedin, deletePost)
router.get('/following-posts', isLogedin, getFollowingPosts)
router.get('/:id/like-dislike', isLogedin, likeDislikePost)
router.get('/:id/add-bookmark', isLogedin, addBookMarkPost)


export default router