import express from 'express'
import { isLogedin } from '../middleware/isLogedIn.middleware.js';
import { createComment } from '../controller/comment.controller.js';

const router = express.Router();


router.post('/:id', isLogedin, createComment)
router.get('/:id', )
router.delete('/:id')


export default router