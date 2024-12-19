import User from '../models/User.js';
import multer from 'multer'
import { saveBinaryFile, loadBinaryFile } from '../utils/fsUtils.js'

// Multer 설정
const upload = multer({
    storage: multer.memoryStorage(), // 메모리에 바이너리 저장
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
});

async function loginUser(req, res) {
    try{
        const { email, password } = req.body;

        const user = await User.login(email, password);
        if(!user){
            res.status(401).json({message: "회원 정보가 일치하지 않습니다."});
        }

        // 세션 설정
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.profile_img = loadBinaryFile(user.profile_img.split('\\').pop()).toString('base64');
        req.session.username = user.username;
        req.session.save(err => {
            if (err) throw err;
            return res.status(200).json({
                message: "로그인 성공",
                data: {
                    user_id: user.id,
                }
            });
        });
        
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

async function signupUser(req, res) {
    try {
        const { email, pwd, pwd2, username } = req.body;

        // 비밀번호 확인
        if (pwd !== pwd2) {
            return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        let profile_img = null;
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            profile_img = saveBinaryFile(fileName, req.file.buffer); // 파일 저장
        }
        else {
            profile_img = 'default_profile.jpg';
        }

        // 사용자 생성
        const newUser = new User(null, email, pwd, username, profile_img, new Date(), new Date());
        const createdUser = await newUser.addUser();
        if (!createdUser) {
            console.log('controller signup error')
            return res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
        }
        // 세션 설정
        req.session.userId = createdUser.id;
        req.session.email = createdUser.email;
        req.session.profile_img = loadBinaryFile(createdUser.profile_img.split('\\').pop()).toString('base64');
        req.session.username = createdUser.username;

        return res.status(201).json({ message: '회원가입 성공!', data: createdUser });
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: "로그아웃 실패" });
        }
        
        return res.json({ message: "로그아웃 성공" });
    });
}

export { loginUser, signupUser, logout, upload };
