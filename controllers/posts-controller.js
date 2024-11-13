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
    const user = users.find((u) => u.id == user_id );

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

function getPostDetail(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    const dataPath = path.join(__dirname,'.','public','data','posts.json');
    const rawData = fs.readFileSync(dataPath);
    const posts = JSON.parse(rawData).posts;
    const post_id = parseInt(req.params.post_id);
    const post = posts.find((p) => p.id == post_id);

    if(post){
        res.status(200).send({
            message: "게시글 상세 조회 성공",
            data: post
        })
    }
    else{
        res.status(404).json({message: "존재하지 않는 리소스입니다"})
    }
}

function getComments(req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    const dataPath = path.join(__dirname,'.','public','data','comments.json');
    const rawData = fs.readFileSync(dataPath);
    const comments = JSON.parse(rawData).comments;
    const post_id = parseInt(req.params.post_id);
    const comment = comments.filter((c) => c.post_id == post_id);
    
    if(comment){
        res.status(200).send({
            message: "댓글 조회 성공",
            data: comment
        })
    }
    else{
        res.status(404).json({message: "존재하지 않는 리소스입니다"})
    }
}
function getLikes(req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    const dataPath = path.join(__dirname,'.','public','data','likes.json');
    const rawData = fs.readFileSync(dataPath);
    const likes = JSON.parse(rawData).likes;
    const post_id = parseInt(req.params.post_id);
    const like_list = likes.filter((l) => l.post_id == post_id && l.status == 1);
    const userIds = like_list.map(like => like.user_id);

    if(userIds){
        res.status(200).send({
            message: "좋아요 조회 성공",
            data: userIds
        })
    }
    else{
        res.status(404).json({message: "존재하지 않는 리소스입니다"})
    }
}

export { getPosts, getAuthorProfile, getPostDetail, getComments, getLikes };
