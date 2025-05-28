import express from 'express'
import {register, login, testClientInfo } from '../controller/auth.controller.js';


const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/test', testClientInfo)

export default router;