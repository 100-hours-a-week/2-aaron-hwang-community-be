import { dbPool } from '../utils/dbUtils.js';
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

    static async loadLikes() {
        const query = 'SELECT * FROM likes WHERE status = 1';
        const [rows] = await dbPool.execute(query);
        return rows;
    }

    static async getLikeByPostId (post_id) {
        const query = `
            SELECT * FROM likes
            WHERE post_id = ? AND status = 1
        `;
        const [rows] = await dbPool.execute(query, [post_id]);

        return rows;
    }

    static async isValidPost(post_id) {
        const query = `
            SELECT COUNT(*) as count FROM posts
            WHERE id = ?
        `;
        const [rows] = await dbPool.execute(query, [post_id]);
        return rows[0].count > 0;
    }

    static async exsistLike(post_id, user_id) {
        const query = `
            SELECT * FROM likes
            WHERE post_id = ? AND user_id = ?
        `;
        const [rows] = await dbPool.execute(query, [post_id, user_id]);
        return rows.length > 0 ? rows[0] : null;
    }


    async createLike() {
        try {            
            const query = `
                INSERT INTO likes (post_id, user_id, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            `;
            const now = formatDate(new Date())
            const [result] = await dbPool.execute(query, [
                this.post_id,
                this.user_id,
                this.status,
                now,
                now
            ]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }

    static async updateLike(post_id, user_id) {        
        const existingLike = await Like.exsistLike(post_id, user_id);

        if (!existingLike) {
            const newLike = new Like(null, post_id, user_id, 1);
            return await newLike.createLike();
        }

        const newStatus = existingLike.status === 1 ? 0 : 1;
        const query = `
            UPDATE likes
            SET status = ?, updated_at = ?
            WHERE id = ?
        `;
        const [result] = await dbPool.execute(query, [
            newStatus,
            formatDate(new Date()),
            existingLike.id
        ]);

        return result.affectedRows > 0 ? newStatus : null;
    }
  }

export default Like;
