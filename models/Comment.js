import formatDate from '../utils/dateUtils.js';
import { dbPool } from '../utils/dbUtils.js';
import Post from './Post.js';

class Comment {
    constructor (id=null, post_id=null, author_id=null, content, createdAt, updatedAt) {
        this.id = id;
        this.post_id = post_id;
        this.author_id = author_id;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async loadComments() {
        const query = 'SELECT * FROM comments';
        const [rows] = await dbPool.execute(query);
        return rows;
    }

    static async getCommentByPostId(post_id) {
        const query = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC';
        const [rows] = await dbPool.execute(query, [post_id]);
        return rows;
    }

    async createComment() {
        try {
            if (!this.content) {
                return { success: false, error: '내용이 빈칸이 될 수 없습니다.' };
            }

            const query = `
                INSERT INTO comments (post_id, author_id, content, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            `;
            const now = formatDate(new Date());
            const [result] = await dbPool.execute(query, [
                this.post_id,
                this.author_id,
                this.content,
                now,
                now
            ]);
            return result.insertId;
        } catch (error) {
            return false;
        }
    }

    static async findByUserId(userId) {
        const query = `
            SELECT *
            FROM comments
            WHERE comments.author_id = ?
        `;
        const [rows] = await dbPool.execute(query, [userId]);
        if (rows.length === 0) return null;

        const comments = rows;
        return comments;
    }

    static async isValidPost(postId) {
        const post = await Post.findById(postId);
        if (!post) return false;
        return true;
    }

    static async updateComment(id, content) {
        if (!content) {
            return false;
        }

        const query = `
            UPDATE comments 
            SET content = ?, updated_at = ?
            WHERE id = ?
        `;
        const [result] = await dbPool.execute(query, [content, formatDate(new Date()), id]);

        return result.affectedRows > 0
    }

    static async deleteComment(id) {
        const query = `DELETE FROM comments WHERE id = ?`;
        const [result] = await dbPool.execute(query, [id]);
        return result.affectedRows > 0;
    }
  }

export default Comment;
