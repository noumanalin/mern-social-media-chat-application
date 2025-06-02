import express from 'express'
import { isLogedin } from '../middleware/isLogedIn.middleware.js';
import { createMessage, getMessages, getConversation } from '../controller/message.controller.js'


const router = express.Router();


router.post('/:receiverId', isLogedin, createMessage)
router.get('/:receiverId', isLogedin, getMessages)
router.get('/conversations', isLogedin, getConversation)


export default router;