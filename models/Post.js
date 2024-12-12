import { dbPool } from '../utils/dbUtils.js';
import formatDate from '../utils/dateUtils.js';

class Post {
    constructor(id, author_id, title, content, image, likes, views, comments, createdAt, updatedAt) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.content = content;
        this.image = image || '';
        this.likes = likes || [];
        this.views = views || 0;
        this.comments = comments || [];
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async loadPosts() {
        const query = `
            SELECT posts.*, 
                   users.username AS author_username, 
                   users.profile_img AS author_profile_img
            FROM posts
            LEFT JOIN users ON posts.author_id = users.id
        `;
        const [rows] = await dbPool.execute(query);
        
        for (const post of rows) {
            post.likes = await Post.getLikesByPostId(post.id);
            post.comments = await Post.getCommentsByPostId(post.id);
        }

        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT posts.*, 
                   users.username AS author_username, 
                   users.profile_img AS author_profile_img
            FROM posts
            LEFT JOIN users ON posts.author_id = users.id
            WHERE posts.id = ?
        `;
        const [rows] = await dbPool.execute(query, [id]);
        if (rows.length === 0) return null;

        const post = rows[0];
        post.likes = await Post.getLikesByPostId(post.id);
        post.comments = await Post.getCommentsByPostId(post.id);
        post.comments.sort((a, b) => b.id - a.id)
        return post;
    }

    static async findByUserId(userId) {
        const query = `
            SELECT *
            FROM posts
            WHERE posts.author_id = ?
        `;
        const [rows] = await dbPool.execute(query, [userId]);
        if (rows.length === 0) return null;

        const post = rows;
        
        return post;
    }

    static async incrementView(id) {
        const query = `UPDATE posts SET views = views + 1 WHERE id = ?`;
        const [result] = await dbPool.execute(query, [id]);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    }
    
    async createPost() {
        if (!this.title || !this.content) {
            throw new Error('제목, 내용은 필수 입력 사항입니다.');
        }

        const query = `
            INSERT INTO posts (author_id, title, content, image, comments, likes, views, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const now = formatDate(new Date());
        const [result] = await dbPool.execute(query, [
            this.author_id,
            this.title,
            this.content,
            this.image,
            [], // 초기 댓글
            [], // 초기 좋아요
            0, // 초기 조회수
            now,
            now,
        ]);

        return result.insertId;
    }

    async updatePost() {
        const query = `
            UPDATE posts
            SET title = ?, content = ?, image = ?, updated_at = ?
            WHERE id = ?
        `;
        const updatedAt = formatDate(new Date());
        const [result] = await dbPool.execute(query, [
            this.title,
            this.content,
            this.image,
            updatedAt,
            this.id,
        ]);
        return result.affectedRows > 0;
    }

    static async deletePost(id) {
        const query = `DELETE FROM posts WHERE id = ?`;
        const [result] = await dbPool.execute(query, [id]);
        return result.affectedRows > 0;
    }

    // 특정 게시글의 좋아요 가져오기
    static async getLikesByPostId(postId) {
        const query = `SELECT * FROM likes WHERE post_id = ? AND status = 1`;
        const [rows] = await dbPool.execute(query, [postId]);
        return rows;
    }

    // 특정 게시글의 댓글 가져오기
    static async getCommentsByPostId(postId) {
        const query = `
            SELECT comments.*, 
                    users.username AS author_username, 
                    users.profile_img AS author_profile_img
            FROM comments
            LEFT JOIN users ON comments.author_id = users.id
            WHERE comments.post_id = ?
            ORDER BY created_at ASC
        `;
        const [rows] = await dbPool.execute(query, [postId]);
        return rows;
    }    
}

export default Post;
