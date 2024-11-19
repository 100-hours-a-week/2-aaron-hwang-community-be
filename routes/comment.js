// TODO: router 합치기
import express from 'express';
import bodyParser from 'body-parser';
import { getCommentAuthor } from '../controllers/comments-controller.js';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:author_id/author', getCommentAuthor);


// TODO: 

export default router;
