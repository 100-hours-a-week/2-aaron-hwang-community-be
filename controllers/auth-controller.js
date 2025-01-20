import User from '../models/User.js';
import { upload, uploadFileToS3, deleteFileFromS3 } from '../middlewares/multer-s3.js';

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
        if (user.profile_img){
            req.session.profile_img = user.profile_img
        } else {
            req.session.profile_img = `https://${process.env.CLOUDFRONT_DOMAIN}/default_profile.jpg`
        }
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
            profile_img = await uploadFileToS3(req.file); // 파일 저장
        } else {
            profile_img = `https://${process.env.CLOUDFRONT_DOMAIN}/default_profile.jpg`
        }    

        // 사용자 생성
        const newUser = new User(null, email, pwd, username, profile_img, new Date(), new Date());
        const createdUser = await newUser.addUser();
        if (!createdUser) {
            return res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
        }
        /* 
        // 세션 설정
        req.session.userId = createdUser.id;
        req.session.email = createdUser.email;
        req.session.profile_img = loadBinaryFile(createdUser.profile_img.split('\\').pop()).toString('base64');
        req.session.username = createdUser.username;
        */
        return res.status(201).json({ message: '회원가입 성공!', data: createdUser });
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

async function logout(req, res) {
    await req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "서버사이드 세션 삭제 오류" });
            
        res.clearCookie('connect.sid');
        res.status(200).json({ message: '로그아웃이 성공적으로 처리되었습니다.' });
    });
}

export { loginUser, signupUser, logout, upload };
