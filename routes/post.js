// TODO: router 합치기
import express from 'express';
import bodyParser from 'body-parser';
import { getPosts, getPostDetail, createPost, updatePost, deletePost } from '../controllers/posts-controller.js';
import { updateLike } from '../controllers/likes-controller.js';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', getPosts);
router.get('/:post_id', getPostDetail);
router.post('/', createPost);
router.patch('/:post_id', updatePost);
router.delete('/:post_id', deletePost);

// 좋아요 기능
router.post('/:post_id/likes', updateLike);

// TODO: 작성자 url 수정

export default router;
