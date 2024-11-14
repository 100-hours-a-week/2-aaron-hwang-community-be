import fs from 'fs';
import path from 'path';
import connection from './db.js';

const __dirname = path.resolve();

class Post {
    constructor(id, author_id, title, content, image, likes, views, comments, createdAt, updatedAt) {
        this.id = id;
        this.author_id = author_id;
        this.title = title;
        this.content = content;
        this.image = image;
        this.likes = likes;
        this.views = views;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static loadPosts() {
        const dataPath = path.join(__dirname, 'public', 'data', 'posts.json');
        const rawData = fs.readFileSync(dataPath);
        const posts = JSON.parse(rawData).posts;
        return posts;
    }

    static savePosts(posts) {
        const dataPath = path.join(__dirname, 'public', 'data', 'posts.json');
        fs.writeFileSync(dataPath, JSON.stringify({ posts }, null, 2));
    }

    createPost() {
        try{
            const posts = this.loadPosts();
            const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;

            posts.push({ 
                id: newId, 
                author_id: this.author_id,
                title: this.title,
                content: this.content,
                image: this.image || '',
                likes: null,
                views: 0,
                comments: null,
                createdAt: new Date(), 
                updatedAt: new Date() 
            });
            Post.savePosts(posts);
            return true;

        } catch {
            return false;
        }
    }

    updatePost() {
        const posts = this.loadPosts();
        const postIndex = posts.findIndex(post => post.id == this.id);

        if (postIndex === -1) {
            return false;
        }

        posts[postIndex] = {
            ...posts[postIndex],
            title: this.title,
            content: this.content,
            image: this.image || '',
            updatedAt: new Date()
        };

        this.savePosts(posts);
        return true;
    }

    static deletePost(id) {
        let posts = this.loadPosts();
        const postIndex = posts.findIndex(post => post.id === id);

        if (postIndex === -1) {
            return true;
        }

        posts.splice(postIndex, 1);
        this.savePosts(posts);

        return true;
    }
  }

export default Post;
