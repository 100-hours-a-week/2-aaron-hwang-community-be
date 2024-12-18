import Post from '../models/Post.js'
import Like from '../models/Like.js'
import Comment from '../models/Comment.js'
import multer from 'multer'
import { saveBinaryFile, loadBinaryFile } from '../utils/fsUtils.js'

// Multer 설정
const upload = multer({
    storage: multer.memoryStorage(), // 메모리에 바이너리 저장
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
});

async function getPosts(req, res){
    try {    
        const posts = await Post.loadPosts();
        
        if(!posts){
            res.status(404).json({message: "존재하지 않는 리소스입니다"});
        }

        posts.forEach(post => {
            try{
                post.author_profile_img = loadBinaryFile(post.author_profile_img.split('\\').pop()).toString('base64');
            }
            catch{
                post.author_profile_img = null;
            }
        })
        
        return res.status(200).json({
            message: "게시글 목록 조회 성공",
            data: posts.sort((a, b) => b.id - a.id)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getPostDetail(req, res) {
    try {    
        const postId = parseInt(req.params.post_id);
        
        // 조회수 증가
        const incrementResult = Post.incrementView(postId);
        if(!incrementResult) {
            return res.status(403).json({message: "잘못된 요청입니다"});
        }

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({message: "게시글을 찾을 수 없습니다"});
        }

        try {
            post.image = loadBinaryFile(post.image.split('\\').pop()).toString('base64');
        }
        catch {
            post.image = null
        }

        try {
            post.author_profile_img = loadBinaryFile(post.author_profile_img.split('\\').pop()).toString('base64');
        }
        catch {
            post.author_profile_img = null
        }        

        post.comments.forEach(comment => {
            try{
                comment.author_img = loadBinaryFile(comment.author_img.split('\\').pop()).toString('base64');
            }
            catch{
                comment.author_img = null;
            }
        })

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
        const { title, content } = req.body;
        const authorId = req.session.userId;

        if (!title || !content) {
            return res.status(400).json({ message: '제목, 내용은 필수입니다.' });
        }

        let imagePath = null;
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            imagePath = saveBinaryFile(fileName, req.file.buffer); // 파일 저장
        }
        
        const post = new Post(null, authorId, title, content, imagePath);
        const result = post.createPost();
        if (!result) {
            return res.status(500).json({ message: '게시글 생성 중 오류가 발생했습니다.' });
        }

        return res.status(201).json({ message: '게시글 작성 성공', data: post });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function updatePost(req, res) {
    try {
        const postId = parseInt(req.params.post_id);
        const { title, content } = req.body;
        const userId = req.session.userId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        if (post.author_id !== userId) {
            return res.status(401).json({ message: "권한 없음" });
        }

        if (!title && !content) {
            return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
        }

        let imagePath = null;
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            imagePath = saveBinaryFile(fileName, req.file.buffer); // 파일 저장
        }

        const updatedPost = new Post(postId, null, title, content, imagePath).updatePost();

        return res.status(200).json({
            message: "게시글 수정 성공",
            data: updatedPost
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

async function deletePost(req, res) {
    try {
        const postId = parseInt(req.params.post_id);
        const userId = req.session.userId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        if (post.author_id !== userId) {
            return res.status(401).json({ message: "권한 없음" });
        }

        
        const likes = await Like.getLikeByPostId(postId);
        if (likes) {
            likes.forEach(async like => {
                await Like.deleteLike(like.id);
        });}
        const comments = await Comment.getCommentByPostId(postId);
        if (comments){
            comments.forEach(async comment => {
                await Comment.deleteComment(comment.id);
        });}

        const result = Post.deletePost(postId);
        if (!result){
            return res.status(500);
        }

        return res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { getPosts, getPostDetail, createPost, updatePost, deletePost, upload };
