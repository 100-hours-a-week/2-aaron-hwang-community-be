// TODO: router 합치기
import express from 'express';
import bodyParser from 'body-parser';
import { createComment, updateComment, deleteComment } from '../controllers/comments-controller.js';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/:post_id', createComment);
router.patch('/:comment_id', updateComment);
router.delete('/:comment_id', deleteComment);

export default router;
