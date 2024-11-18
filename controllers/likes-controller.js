import Like from '../models/Like.js';

function createLike(req, res) {
    const post_id = parseInt(req.params.post_id);
    const user_id = req.session.userId
    if (!user_id) {
        return res.status(401).json({ message: "권한 없음" })
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
        return res.status(401).json({ message: "권한 없음" })
    }

    try {
        Like.updateLike(post_id, user_id);
        return res.status(200).send({ message: '좋아요 Updated!' });
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

export { createLike, updateLike };