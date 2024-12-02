import Post from '../models/Post.js'

function getPosts(req, res){
    try {    
        const posts = Post.loadPosts();

        if(!posts){
            res.status(404).json({message: "존재하지 않는 리소스입니다"});
        }

        return res.status(200).json({
            message: "게시글 목록 조회 성공",
            data: posts
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

function getPostDetail(req, res) {
    try {    
        const postId = parseInt(req.params.post_id);
        
        // 조회수 증가
        const incrementResult = Post.incrementView(postId);
        if(!incrementResult) {
            return res.status(404).json({message: "게시글을 찾을 수 없습니다"});
        }

        const posts = Post.loadPosts();
        const post = posts.find((p) => p.id == postId);
        if(!post) {
            return res.status(404).json({message: "게시글을 찾을 수 없습니다"});
        }

        return res.status(200).json({
            message: "게시글 상세 조회 성공",
            data: post
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

function createPost(req, res) {
    try {
        const { title, content, image } = req.body;
        const authorId = req.session.userId;

        if (!title || !content) {
            return res.status(400).json({ message: '제목, 내용은 필수입니다.' });
        }

        const post = new Post(null, authorId, title, content, image);
        const result = post.createPost();
        if (!result) {
            return res.status(500).json({ message: '게시글 생성 중 오류가 발생했습니다.' });
        }

        return res.status(201).json({ message: '게시글 작성 성공', data: post });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

function updatePost(req, res) {
    try {
        const postId = parseInt(req.params.post_id);
        const { title, content, image } = req.body;

        if (!title && !content) {
            return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
        }

        const updatedPost = new Post(postId, null, title, content, image).updatePost();
        if (!updatedPost) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        return res.status(200).json({
            message: "게시글 수정 성공",
            data: updatedPost
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

function deletePost(req, res) {
    try {
        const postId = parseInt(req.params.post_id);

        const success = Post.deletePost(postId);
        if (!success) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { getPosts, getPostDetail, createPost, updatePost, deletePost };
