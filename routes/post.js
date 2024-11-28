import express from 'express';
import { getPosts, getPostDetail, createPost, updatePost, deletePost } from '../controllers/posts-controller.js';
import { updateLike } from '../controllers/likes-controller.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:post_id', getPostDetail);
router.post('/', createPost);
router.patch('/:post_id', updatePost);
router.delete('/:post_id', deletePost);

// 좋아요 기능
router.post('/:post_id/likes', updateLike);

export default router;
