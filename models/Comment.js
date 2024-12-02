import { loadJSON, saveJSON } from '../utils/fsUtils.js';
import formatDate from '../utils/dateUtils.js';
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

    static loadComments() {
        return loadJSON('comments.json').comments;
    }

    static saveComments(comments) {
        saveJSON('comments.json', { comments });
    }

    static getCommentByPostId(post_id) {
        const comments = this.loadComments();
        return comments.filter(comment => comment.post_id === post_id);
    }

    createComment() {
        if (!this.content) {
            return { success: false, error: '내용이 빈칸이 될 수 없습니다.' };
        }
       
        const comments = Comment.loadComments();
        const newId = comments.length > 0 ? Math.max(...comments.map(comment => comment.id)) + 1 : 1;

        const newComment = { 
            id: newId, 
            post_id: this.post_id,
            author_id: this.author_id,
            content: this.content,
            createdAt: formatDate(new Date()), 
            updatedAt: formatDate(new Date())
        }
        
        comments.push(newComment);
        Comment.saveComments(comments);
        return newComment;
    }

    static isValidPost(postId) {
        const posts = Post.loadPosts();
        return posts.some(post => post.id == postId);
    }

    static updateComment(id, content) {
        if (!content) {
            return false;
        }

        const comments = Comment.loadComments();
        const comment = comments.find(c => c.id == id);

        if (!comment) return false;

        comment.content = content;
        comment.updatedAt = formatDate(new Date());
        
        this.saveComments(comments);
        return comment;
    }

    static deleteComment(id) {
        const comments = this.loadComments();
        const commentIndex = comments.findIndex(c => c.id === id);

        if (commentIndex === -1) return true;

        comments.splice(commentIndex, 1);
        this.saveComments(comments);
        return true;
    }
  }

export default Comment;
