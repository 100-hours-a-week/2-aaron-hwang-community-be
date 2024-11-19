// TODO: router 합치기
import express from 'express';
import bodyParser from 'body-parser';
import { createLike, updateLike } from '../controllers/likes-controller.js';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/:post_id', updateLike);

// TODO: 

export default router;
