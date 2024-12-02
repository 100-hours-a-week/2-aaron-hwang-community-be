import { loadJSON, saveJSON } from '../utils/fsUtils.js';
import formatDate from '../utils/dateUtils.js';
import Post from './Post.js';

class Like {
    constructor (id=null, post_id=null, user_id=null, status, createdAt, updatedAt) {
        this.id = id;
        this.post_id = post_id;
        this.user_id = user_id;
        this.status = status || 1;
        this.createdAt = createdAt|| formatDate(new Date());
        this.updatedAt = updatedAt || formatDate(new Date());
    }

    static loadLikes() {
        return loadJSON('likes.json').likes;
    }

    static saveLikes(likes) {
        saveJSON('likes.json', { likes });
    }

    static getLikeByPostId (post_id) {
        const likes = this.loadLikes();
        return likes.filter(like => like.post_id === post_id && like.status === 1);
    }

    static findLike(post_id, user_id) { // 사용되지 않는 메소드
        const likes = this.loadLikes();
        return likes.find(like => like.post_id == post_id && like.user_id === user_id);
    }

    createLike() {
        if (!Like.isValidPost(this.post_id)) {
            return false;
        }

        const likes = Like.loadLikes();
        const newId = likes.length > 0 ? Math.max(...likes.map(like => like.id)) + 1 : 1;
        
        const newLike = { 
            id: newId, 
            post_id: this.post_id,
            user_id: this.user_id,
            status: 1,
            createdAt: formatDate(new Date()),
            updatedAt: formatDate(new Date())
        }
        
        likes.push(newLike);
        Like.saveLikes(likes);
        return true;
    }

    static isValidPost(postId) {
        const posts = Post.loadPosts();
        return posts.some(post => post.id == postId);
    }

    static updateLike(post_id, user_id) {
        if (!Like.isValidPost(post_id)) {
            return false;
        }
        
        const likes = Like.loadLikes();
        const like = likes.find(l => l.post_id == post_id && l.user_id == user_id);

        if (!like) {
            const newLike = new Like(null, post_id, user_id, 1);
            return newLike.createLike()
        }

        like.status = like.status == 1? 0 : 1;
        like.updatedAt = formatDate(new Date());

        this.saveLikes(likes);

        return like;
    }
  }

export default Like;
