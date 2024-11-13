import path from 'path';
import fs from 'fs';
import { login, signup } from '../models/user.js';

const __dirname = path.resolve();

function loginUser(req, res) {
    const { email, password } = req.body;
    console.log(req.body)
    const dataPath = path.join(__dirname,'.','public','data','users.json');
    const rawData = fs.readFileSync(dataPath);
    const users = JSON.parse(rawData).users;

    const user = users.find((u) => u.email === email );
    console.log(user)

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if(user.password === password){
        req.session.userId = user.id;
        console.log("session", req.session)
        res.status(200).send({
            message: "로그인 성공",
            data: {
                user_id: user.id,
            }
        })
    }
    else{
        res.status(401).json({message: "회원 정보가 일치하지 않습니다."})
    }

}

function signupUser(req, res) {
    const { email, pwd, profile_img, pwd2, username } = req.body;
    console.log(req.body);

    signup(email, pwd, profile_img, username, (err, result) => {
        if (err) return res.status(500).send('가입에 실패했습니다.');
        return res.status(200).send('회원가입 성공!');
    });
}

function getUserProfile(req, res) {
    //const user_id = parseInt(req.params.id);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if(req.session.userId) {
        
        const dataPath = path.join(__dirname,'.','public','data','users.json');
        const rawData = fs.readFileSync(dataPath);
        const users = JSON.parse(rawData).users;
        const user = users.find((u) => u.id == req.session.userId );
        if(user){
            res.status(200).send({
                message: "화원정보 조회 성공",
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    profile_img: user.profile_img
                }
            })
        }
        else{
            res.status(404).json({message: "존재하지 않는 사용자입니다"})
        }
    }
    
    
}

export { loginUser, signupUser, getUserProfile };
