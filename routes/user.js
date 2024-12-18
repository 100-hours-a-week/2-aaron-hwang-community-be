import express from 'express';
import { getSessionUser, getUserProfile, updateUserProfile, updatePassword, deleteUser, upload } from '../controllers/user-controller.js';

const router = express.Router();

router.get('/', getSessionUser);
router.get('/:user_id', getUserProfile);
router.patch('/:user_id', upload.single('image'), updateUserProfile);
router.patch('/:user_id/password', updatePassword);
router.delete('/:user_id', deleteUser);

export default router;