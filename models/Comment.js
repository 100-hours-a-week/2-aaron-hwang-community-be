import fs from 'fs';
import path from 'path';
import formatDate from '../utils/formatDate.js';

const __dirname = path.resolve();

class Comment {
    constructor (id=null, post_id=null, author_id=null, content, createdAt, updatedAt) {
        this.id = id;
        this.post_id = post_id;
        this.author_id = author_id;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static loadComments() {
        const dataPath = path.join(__dirname, 'public', 'data', 'comments.json');
        const rawData = fs.readFileSync(dataPath);
        const comments = JSON.parse(rawData).comments;
        return comments;
    }

    static saveComments(comments) {
        const dataPath = path.join(__dirname, 'public', 'data', 'comments.json');
        fs.writeFileSync(dataPath, JSON.stringify({ comments }, null, 2));
    }

    createComment() {
        if (!this.content) {
            return { success: false, error: '내용이 빈칸이 될 수 없습니다.' };
        }
        try{
            const comments = Comment.loadComments();
            const newId = comments.length > 0 ? Math.max(...comments.map(comment => comment.id)) + 1 : 1;

            comments.push({ 
                id: newId, 
                post_id: this.post_id,
                author_id: this.author_id,
                content: this.content,
                createdAt: formatDate(new Date()), 
                updatedAt: formatDate(new Date())
            });
            Comment.saveComments(comments);
            return true;

        } catch {
            return false;
        }
    }

    static updateComment(id, content) {
        const comments = Comment.loadComments();
        const commentIndex = comments.findIndex(c => c.id == id);

        if (commentIndex === -1) {
            return false;
        }

        comments[commentIndex] = {
            ...comments[commentIndex],
            content: content,
            updatedAt: formatDate(new Date())
        };

        Comment.saveComments(comments);
        return true;
    }

    static deleteComment(id) {
        let comments = this.loadComments();
        const commentIndex = comments.findIndex(c => c.id === id);

        if (commentIndex === -1) {
            return true;
        }

        comments.splice(commentIndex, 1);
        this.saveComments(comments);

        return true;
    }
  }

export default Comment;
