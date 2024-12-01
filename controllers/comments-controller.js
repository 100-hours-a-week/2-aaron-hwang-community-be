import Comment from '../models/Comment.js';

function createComment(req, res) {
    try {
        const { commentContent } = req.body;
        const postId = parseInt(req.params.post_id);
        /* const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "권한 없음" })
        } */
        
        // 필수 데이터 검증
        if (!commentContent) {
            return res.status(400).json({ message: "댓글 내용은 필수입니다." });
        }
        
        const newComment = new Comment(null, postId, 1, commentContent); // 임시로 author_id는 1로 설정
        const result = newComment.createComment();
        if(!result) {
            return res.status(500).json({ message: "댓글 생성 중 오류가 발생했습니다." });
        }

        return res.status(201).json({ message: '댓글 작성 성공!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

function updateComment(req, res) {    
    try {
        const commentId =  parseInt(req.params.comment_id);
        const { commentContent } = req.body;
        /* const userId = req.session.userId
        if (!userId) {
            return res.status(401).json({ message: "권한 없음" })
        }
        */

        // 필수 데이터 검증
        if (!commentContent) {
            return res.status(400).json({ message: "댓글 내용은 필수입니다." });
        }

        const result = Comment.updateComment(commentId, commentContent);
        if (!result) {
            return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });            
        }

        return res. status(200).json({ message: '댓글 수정 성공!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

function deleteComment(req, res) {
    try {
        const commentId = parseInt(req.params.comment_id);
        /* 
        const userId = req.session.userId

        if (!userId) {
            return res.status(401).json({ message: "권한 없음" })
        } */

        const result = Comment.deleteComment(commentId);
        if (!result) {
            return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });            
        }
        
        return res.status(200).json({ message: '댓글 삭제 성공!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

export { createComment, updateComment, deleteComment };