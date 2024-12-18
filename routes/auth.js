import express from 'express';
import { loginUser, signupUser, logout, upload } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', upload.single('image'), signupUser);
router.post('/logout', logout)

export default router;