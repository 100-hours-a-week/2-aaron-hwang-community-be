import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

function getPosts(req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const dataPath = path.join(__dirname,'.','public','data','posts.json');
    const rawData = fs.readFileSync(dataPath);
    const posts = JSON.parse(rawData).posts;

    if(posts){
        res.status(200).send({
            message: "게시글 목록 조회 성공",
            data: posts
        })
    }
    else{
        res.status(404).json({message: "존재하지 않는 리소스입니다"})
    }
}

function getAuthorProfile(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    const dataPath = path.join(__dirname,'.','public','data','users.json');
    const rawData = fs.readFileSync(dataPath);
    const users = JSON.parse(rawData).users;
    const user_id = parseInt(req.params.author_id)
    console.log(req.params)
    const user = users.find((u) => u.id == user_id );
    console.log(user)
    if(user){
        res.status(200).send({
            message: "화원정보 조회 성공",
            data: {
                username: user.username,
                profile_img: user.profile_img
            }
        })
    }
    else{
        res.status(404).json({message: "존재하지 않는 사용자입니다"})
    }

    
    
}

export { getPosts, getAuthorProfile };
