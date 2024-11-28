import express from 'express';
import { getSessionUser, getUserProfile, updateUsername, updatePassword, deleteUser } from '../controllers/user-controller.js';

const router = express.Router();

router.get('/', getSessionUser);
router.get('/:user_id', getUserProfile);
router.patch('/:user_id', updateUsername);
router.patch('/:user_id/password', updatePassword);
router.delete('/:user_id', deleteUser);

export default router;