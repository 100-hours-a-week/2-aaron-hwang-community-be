// TODO: router 합치기
import express from 'express';
import bodyParser from 'body-parser';
import { loginUser, signupUser, getSessionUser, getUserProfile, updateUsername, updatePassword, deleteUser, logout } from '../controllers/auth-controller.js';



const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/users', getSessionUser);
router.get('/users/:user_id', getUserProfile);
router.patch('/users/:user_id', updateUsername);
router.patch('/users/:user_id/password', updatePassword);
router.delete('/users/:user_id', deleteUser);

router.post('/logout', logout)
export default router;
