import User from '../models/User.js';

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
        req.session.profile_img = user.profile_img;
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
        const { email, pwd, pwd2, profile_img, username } = req.body;

        // 비밀번호 확인
        if (pwd !== pwd2) {
            return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        // 사용자 생성
        const newUser = new User(null, email, pwd, username, profile_img, new Date(), new Date());
        await newUser.addUser();

        return res.status(201).json({ message: '회원가입 성공!' });
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

export { loginUser, signupUser, logout };
