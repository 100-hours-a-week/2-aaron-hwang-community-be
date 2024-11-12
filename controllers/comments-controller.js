import path from 'path';
import fs, { futimesSync } from 'fs';

const __dirname = path.resolve();

function getCommentAuthor(req,res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    const dataPath = path.join(__dirname,'.','public','data','users.json');
    const rawData = fs.readFileSync(dataPath);
    const users = JSON.parse(rawData).users;
    const author_id = parseInt(req.params.author_id)
    const user = users.find((a) => a.id == author_id );

    if(user){
        res.status(200).send({
            message: "댓글 게시자 조회 성공",
            data: {
                username: user.username,
                profile_img: user.profile_img
            }
        })
    }
    else{
        res.status(404).json({message: "존재하지 않는 댓글 게시자입니다"})
    }
}

export { getCommentAuthor };