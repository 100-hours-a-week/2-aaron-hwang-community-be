import Post from '../models/Post.js'

function getPosts(req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    const posts = Post.loadPosts();
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

function getPostDetail(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    const post_id = parseInt(req.params.post_id);
    
    // 조회수 증가
    const incrementResult = Post.incrementView(post_id);

    if(!incrementResult) {
        return res.status(404).json({message: "존재하지 않는 리소스입니다"})
    }

    const posts = Post.loadPosts();
    const post = posts.find((p) => p.id == post_id);
    
    res.status(200).send({
        message: "게시글 상세 조회 성공",
        data: post
    });
}

function createPost(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true)

    const { title, content, image } = req.body;
    const author_id = req.session.userId;

    if (!title || !content || !author_id) {
        return res.status(400).json({ message: '제목, 내용, 작성자는 필수입니다.' });
    }

    const post = new Post(null, title, content, author_id, image).createPost();

    if (!post) {
        return res.status(500).json({ message: '게시글 생성 중 오류가 발생했습니다.' });
    }

    res.status(201).json({ message: '게시글 작성 성공', data: post });
}

function updatePost(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    const postId = parseInt(req.params.post_id);
    const { title, content, image } = req.body;

    if (!title && !content) {
        return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
    }

    const updatePost = new Post(postId, null, title, content, image).updatePost();
    res.status(200).send({
        message: "게시글 수정 성공",
        data: updatePost
    });
}

function deletePost(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    const postId = parseInt(req.params.post_id);

    const success = Post.deletePost(postId);

    if (!success) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '게시글 삭제 성공' });
}

export { getPosts, getPostDetail, createPost, updatePost, deletePost };
