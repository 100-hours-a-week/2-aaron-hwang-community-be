import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

class Like {
    constructor (id=null, post_id=null, author_id=null, status, createdAt, updatedAt) {
        this.id = id;
        this.post_id = post_id;
        this.author_id = author_id;
        this.status = status || 1;
        this.createdAt = createdAt|| new Date();
        this.updatedAt = updatedAt || new Date();
    }

    static loadLikes() {
        const dataPath = path.join(__dirname, 'public', 'data', 'likes.json');
        const rawData = fs.readFileSync(dataPath);
        const likes = JSON.parse(rawData).likes;
        return likes;
    }

    static saveLikes(likes) {
        const dataPath = path.join(__dirname, 'public', 'data', 'likes.json');
        fs.writeFileSync(dataPath, JSON.stringify({ likes }, null, 2));
    }

    static createLike(post_id, user_id) {
        try{
            const likes = Like.loadLikes();
            
            const newId = likes.length > 0 ? Math.max(...likes.map(like => like.id)) + 1 : 1;
            console.log(likes)
            likes.push({ 
                id: newId, 
                post_id: post_id,
                user_id: user_id,
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            Like.saveLikes(likes);
            return true;

        } catch {
            return false;
        }
    }

    static updateLike(post_id, user_id) {
        const likes = Like.loadLikes();
        const likeIndex = likes.findIndex(l => l.post_id == post_id && l.user_id == user_id);

        if (likeIndex === -1) {
            return this.createLike(post_id, user_id);
        }

        likes[likeIndex].status = likes[likeIndex].status == 1? 0 : 1;
        likes[likeIndex].updatedAt = new Date();

        this.saveLikes(likes);
        return true;
    }
  }

export default Like;
