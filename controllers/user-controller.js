import User from '../models/User.js';
import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import { uploadFileToS3, deleteFileFromS3 } from '../middlewares/multer-s3.js';


function getSessionUser (req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "권한 없음" });
        }

        const { userId, email, profile_img, username } = req.session;
        
        res.status(200).json({
            message: "회원정보 조회 성공",
            data: {
                id: userId,
                email: email,
                profile_img: profile_img,
                username: username
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getUserProfile (req, res) {
    try {
        const userId = parseInt(req.params.user_id);
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "해당 유저 없음"});
        }

        return res.status(200).json({
            message: "조회 성공",
            data: {
                id: user.id,
                username: user.username,
                profile_img: user.profile_img
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function updateUserProfile (req, res) {
    try {
        const userId = parseInt(req.params.user_id);
        const username = req.body.username;
        const sessionUserId = req.session.userId;
        const oldImage = req.session.profile_img

        if (!(userId === sessionUserId)) {
            return res.status(401).json({ message: "권한 없음" });
        }

        if (!username) {
            return res.status(400).json({ message: '사용자 이름을 입력해주세요.' });
        }

        let profile_img = req.body.profile_img;
        let fileName = '';
        if (req.file) {
            console.log(oldImage)
            if(oldImage.split('/').pop() != 'default_profile.jpg'){
                await deleteFileFromS3(oldImage.split(`/`).pop())}
            profile_img = await uploadFileToS3(req.file); // 파일 저장
        }

        const result = await User.updateUserProfile(userId, username, profile_img);
        if (!result) {
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }
        
        // 세션 업데이트
        console.log(profile_img)
        req.session.profile_img = profile_img.replace(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
            `https://${process.env.CLOUDFRONT_DOMAIN}`);
        req.session.username = username;

        return res.status(200).json({ message: '사용자 이름이 성공적으로 변경되었습니다.' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function updatePassword (req, res){
    try {
        const userId = parseInt(req.params.user_id);
        const { password, newPassword1, newPassword2 } = req.body;
        const sessionUserId = req.session.userId;

        if (!(userId === sessionUserId)) {
            return res.status(401).json({ message: "권한 없음" });
        }

        if (newPassword1 != newPassword2) {
            return res.status(404).json({ message: '비밀번호 확인이 일치하지 않습니다.' });
        }

        const result = await User.updatePassword(userId, password, newPassword1);
        if (!result) {
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }

        return res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function deleteUser (req, res){
    try {    
        const userId = parseInt(req.params.user_id);
        const sessionUserId = req.session.userId;
        const oldImage = req.session.profile_img;

        if (!(userId === sessionUserId)) {
            return res.status(401).json({ message: "권한 없음" });
        }
        
        const posts = await Post.findByUserId(userId);
        if (posts){
            posts.forEach(async post => {
                await Post.deletePost(post.id);
        });}
        const likes = await Like.findByUserId(userId);
        if (likes) {
            likes.forEach(async like => {
                await Like.deleteLike(like.id);
        });}
        const comments = await Comment.findByUserId(userId);
        if (comments){
            comments.forEach(async comment => {
                await Comment.deleteComment(comment.id);
        });}

        // S3 이미지 삭제
        if(oldImage.split('/').pop() != 'default_profile.jpg'){
            await deleteFileFromS3(oldImagefileUrl.split(`${process.env.S3_BUCKET_NAME}/`)[1])}


        const result = User.deleteUser(userId);
        if (!result) {
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 세션 삭제
        req.session.destroy(err => {
            if (err) return res.status(500).json({ message: "서버사이드 세션 삭제 오류" });
            
            res.clearCookie('connect.sid');
            res.status(200).json({ message: '회원 탈퇴가 성공적으로 처리되었습니다.' });
        });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { getSessionUser, getUserProfile, 
    updateUserProfile, updatePassword, deleteUser };
