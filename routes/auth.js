// TODO: router 합치기
import express from 'express';
import bodyParser from 'body-parser';
import { loginUser, signupUser, getSessionUser, getUserProfile, logout } from '../controllers/auth-controller.js';



const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/users', getSessionUser);
router.get('/users/:user_id', getUserProfile);
router.post('/logout', logout)

// TODO: 회원정보 수정, 회원 탈퇴, 비밀번호 수정, 로그아웃

export default router;
