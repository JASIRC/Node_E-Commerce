import express from 'express';
import { login, signup } from '../controller/userController.js';
import uploadImage from '../middleware/image_uploader.js';

const router=express.Router();

router.post('/register',uploadImage,signup);
router.post('/login',login);

export default router;