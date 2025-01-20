import Post from '../models/Post.js'
import Like from '../models/Like.js'
import Comment from '../models/Comment.js'
import { upload, uploadFileToS3, deleteFileFromS3 } from '../middlewares/multer-s3.js';

async function getPosts(req, res){
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;

    try {    
        const posts = await Post.loadPosts();
        if(!posts){
            res.status(404).json({message: "존재하지 않는 리소스입니다"});
        }

        posts.sort((a, b) => b.id - a.id); // 게시글 최신순 정리
        
        // 게시글 페이징
        const startIndex = (page-1) * limit
        if (startIndex >= posts.length) {
            return res.json({
                message: "마지막 게시글 페이지",
                data: [],
                EOD : true
            });
            
        }

        const pagedPosts = posts.slice(startIndex, page*limit); // 6개씩 잘라서 보내기

        pagedPosts.forEach(post => {
            if(post.author_profile_img) {
                post.author_profile_img = post.author_profile_img.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                    `https://${process.env.CLOUDFRONT_DOMAIN}`)
            } else {
                post.author_profile_img = `https://${process.env.CLOUDFRONT_DOMAIN}/default_profile.jpg`
            }    
            console.log("posts-controller>Here2>", post.author_profile_img)
        })
        
        return res.status(200).json({
            message: "게시글 목록 조회 성공",
            data: pagedPosts
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

        if(post.image) {
            console.log(post.image.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                `https://${process.env.CLOUDFRONT_DOMAIN}`))
            post.image = post.image.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                `https://${process.env.CLOUDFRONT_DOMAIN}`)
        } 
        
        if(post.author_profile_img) {
            post.author_profile_img = post.author_profile_img.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                `https://${process.env.CLOUDFRONT_DOMAIN}`)
        } else {
            post.author_profile_img = `https://${process.env.CLOUDFRONT_DOMAIN}/default_profile.jpg`
        }        

        post.comments.forEach(comment => {
            if(comment.author_img) {
                comment.author_img = comment.author_img.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                    `https://${process.env.CLOUDFRONT_DOMAIN}`)
            } else {
                comment.author_img = `https://${process.env.CLOUDFRONT_DOMAIN}/default_profile.jpg`
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

async function createPost(req, res) {
    try {
        const { title, content } = req.body;
        const authorId = req.session.userId;
        if (!authorId) {
            return res.status(401),json({ message: '권한 없음' });
        }

        if (!title || !content) {
            return res.status(400).json({ message: '제목, 내용은 필수입니다.' });
        }

        let imagePath = null;
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            imagePath = await uploadFileToS3(req.file); 
            /* saveBinaryFile(fileName, req.file.buffer); // 파일 저장 */
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
            imagePath = await uploadFileToS3(req.file);
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
