import Like from '../models/Like.js';
import Post from '../models/Post.js';

function createLike(req, res) {
    const post_id = parseInt(req.params.post_id);
    const user_id = req.session.userId
    if (!user_id) {
        return res.status(401).json({ message: "로그인이 필요합니다." })
    }

    try {
        Like.createLike(post_id, user_id);
        
        return res.status(200).send({ message: '좋아요 created!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

function updateLike(req, res) {
    const post_id = parseInt(req.params.post_id);
    const user_id = req.session.userId
    if (!user_id) {
        return res.status(401).json({ message: "로그인이 필요합니다" });
    }

    // 유효성 검증 - 없는 게시글에 좋아요
    const posts = Post.loadPosts();
    const isValidPost = posts.some(post => post.id == post_id);
    if (!isValidPost) {
        return res.status(404).json({ message: '존재하지 않는 게시글입니다' });
    }

    try {
        Like.updateLike(post_id, user_id);
        return res.status(200).send({ message: '좋아요 Updated!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

export { createLike, updateLike };