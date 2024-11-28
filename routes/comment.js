import express from 'express';
import { createComment, updateComment, deleteComment } from '../controllers/comments-controller.js';

const router = express.Router();

router.post('/:post_id', createComment);
router.patch('/:comment_id', updateComment);
router.delete('/:comment_id', deleteComment);

export default router;
