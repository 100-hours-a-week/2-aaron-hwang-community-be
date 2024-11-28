import User from '../models/User.js';

async function loginUser(req, res) {
    const { email, password } = req.body;

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);

    try{
        const user = await User.login(email, password);
        if(!user){
            res.status(401).json({message: "회원 정보가 일치하지 않습니다."})
        }

        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.profile_img = user.profile_img;

        res.status(200).send({
            message: "로그인 성공",
            data: {
                user_id: user.id,
            }
        })
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
}

async function signupUser(req, res) {
    const { email, pwd, profile_img, pwd2, username } = req.body;
    try {
        const newUser = new User(email, pwd, username, profile_img, new Date(), new Date());
        await newUser.addUser();

        return res.status(200).send('회원가입 성공!');
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

function getSessionUser (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Credentials', true);

    if (!req.session.userId) {
        return res.status(401).json({ message: "권한 없음" })
    }
    const { userId, email, profile_img } = req.session;
    res.status(200).send({
        message: "화원정보 조회 성공",
        data: {
            id: userId,
            email: email,
            // username: user.username,
            profile_img: profile_img
        }
    })
}

function getUserProfile (req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const user_id = parseInt(req.params.user_id);
    const users = User.loadUsers();
    const user = users.find(u => u.id == user_id)

    if(!user){
        return res.status(404).json({message: "해당 유저 없음"});
    }
    res.status(200).send({
        message: "조회 성공",
        data: {
            id: user.id,
            username: user.username,
            profile_img: user.profile_img
        }
    })
}

function updateUsername (req, res){
    const user_id = parseInt(req.params.user_id);
    const username = req.body.username;

    if (!username) {
        return res.status(400).json({ message: '사용자 이름을 입력해주세요.' });
    }

    const result = User.updateUsername(user_id, username);
    if (!result) {
        return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '사용자 이름이 성공적으로 변경되었습니다.' });
}

function updatePassword (req, res){
    const user_id = parseInt(req.params.user_id);
    const { password, newPassword1, newPassword2 } = req.body;

    if (newPassword1 != newPassword2) {
        return res.status(404).json({ message: '비밀번호 확인이 일치하지 않습니다.' });
    }

    const result = User.updatePassword(user_id, password, newPassword1);
    if (!result) {
        return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
}

function deleteUser (req, res){
    const user_id = parseInt(req.params.user_id);

    const result = User.deleteUser(user_id);
    if (!result) {
        return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '회원 탈퇴가 성공적으로 처리되었습니다.' });
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: "로그아웃 실패" });
        }
        res.json({ message: "로그아웃 성공" });
    });
};

export { loginUser, signupUser, getSessionUser, getUserProfile, 
    updateUsername, updatePassword, deleteUser, logout };
