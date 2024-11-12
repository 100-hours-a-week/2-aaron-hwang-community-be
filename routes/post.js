// TODO: router 합치기
import express from 'express';
import bodyParser from 'body-parser';
import { getPosts, getAuthorProfile } from '../controllers/posts-controller.js';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', getPosts);
router.get('/author/:author_id', getAuthorProfile);


// TODO: 

export default router;
