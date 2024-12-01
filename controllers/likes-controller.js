import Like from '../models/Like.js';
import Post from '../models/Post.js';

async function updateLike(req, res) {
    try {
        const postId = parseInt(req.params.post_id);
        const userId = req.body.userId; // 임시로 body에서 받아옴
        /*
        if (!userId) {
            return res.status(401).json({ message: "로그인이 필요합니다" });
        }
        */

        // 유효성 검증 - 없는 게시글에 좋아요
        const isValidPost = await Like.isValidPost(postId);
        if (!isValidPost) {
            return res.status(404).json({ message: '존재하지 않는 게시글입니다' });
        }

        // 좋아요 토글
        const status = Like.updateLike(postId, userId);
        
        // 좋아요 수 계산
        const likeCount = Like.getLikeCount(postId);

        return res.status(200).json({ 
            data: {
                likeCount: likeCount,
                status: status
            } 
        });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

export { updateLike };