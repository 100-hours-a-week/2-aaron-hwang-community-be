import User from '../models/User.js';

function loginUser(req, res) {
    const { email, password } = req.body;

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);

    try{
        const user = User.login(email, password);
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

function signupUser(req, res) {
    const { email, pwd, profile_img, pwd2, username } = req.body;
    console.log(email)
    try {
        const newUser = new User(email, pwd, username, profile_img, new Date(), new Date());
        newUser.addUser();

        return res.status(200).send('회원가입 성공!');
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

function getSessionUser (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);

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

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: "로그아웃 실패" });
        }
        res.json({ message: "로그아웃 성공" });
    });
};

export { loginUser, signupUser, getSessionUser, logout };
