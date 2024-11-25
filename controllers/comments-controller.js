import Comment from '../models/Comment.js';

function createComment(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true)
    const { commentContent } = req.body;
    const post_id = parseInt(req.params.post_id);
    console.log('asdasdasd')
    /* const user_id = req.session.userId;
    if (!user_id) {
        return res.status(401).json({ message: "권한 없음" })
    } */

    try {
        const newComment = new Comment(null, post_id, 1, commentContent);
        newComment.createComment();
        console.log(newComment)
        return res.status(200).send({ message: '댓글 작성 성공!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

function updateComment(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("tnwjdgkfjdhKTek")
    const content  = req.body.commentContent;
    const id =  parseInt(req.params.comment_id);
    /* const user_id = req.session.userId
    if (!user_id) {
        return res.status(401).json({ message: "권한 없음" })
    }
 */
    try {
        Comment.updateComment(id, content);
        return res. status(200).send({ message: '댓글 수정 성공!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

function deleteComment(req, res) {
    const id = parseInt(req.params.comment_id);
    const user_id = req.session.userId

    if (!user_id) {
        return res.status(401).json({ message: "권한 없음" })
    }

    try {
        Comment.deleteComment(id);
        return res.status(200).send({ message: '댓글 삭제 성공!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}
/* 
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
                author_id: user.id,
                username: user.username,
                profile_img: user.profile_img
            }
        })
    }
    else{
        res.status(404).json({message: "존재하지 않는 댓글 게시자입니다"})
    }
} */

export { createComment, updateComment, deleteComment };