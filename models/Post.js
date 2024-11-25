import fs from 'fs';
import path from 'path';
import User from './User.js'
import Comment from './Comment.js'
import Like from './Like.js'

const __dirname = path.resolve();

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

    static loadPosts() {
        const dataPath = path.join(__dirname, 'public', 'data', 'posts.json');
        const rawData = fs.readFileSync(dataPath);
        const posts = JSON.parse(rawData).posts;
        const users = User.loadUsers();
        const comments = Comment.loadComments();
        const likes = Like.loadLikes();

        posts.forEach(post => {
            post.author = users.find(u => u.id == post.author_id);
            post.comments = comments.filter(c => c.post_id == post.id);
            post.likes = likes.filter(l => l.post_id == post.id)
        }
        //TODO : author, comments, likes 가져오는 로직 분리

        )
        return posts;
    }

    static savePosts(posts) {
        const dataPath = path.join(__dirname, 'public', 'data', 'posts.json');
        fs.writeFileSync(dataPath, JSON.stringify({ posts }, null, 2));
    }

    static findById(id) {
        const posts = this.loadPosts();
        return posts.find(post => post.id == id);
    }

    static incrementView(id) {
        const posts = this.loadPosts();
        const post = posts.find(post => post.id == id);

        if (!post) return false;
        
        post.views += 1;
        
        this.savePosts(posts);
        return true;

    }

    static deletePost(id) {
        let posts = this.loadPosts();
        const postIndex = posts.findIndex(post => post.id === id);

        if (postIndex === -1) {
            return false;
        }

        posts.splice(postIndex, 1);
        this.savePosts(posts);

        return true;
    }
    
    createPost() {
        const posts = Post.loadPosts();
        const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;

        const newPost = { 
            id: newId, 
            title: this.title,
            content: this.content,
            image: this.image,
            author_id: this.author_id,
            likes: [],
            views: 0,
            comments: [],
            createdAt: new Date(), 
            updatedAt: new Date() 
        };

        posts.push(newPost);
        Post.savePosts(posts);
        return newPost;
    }

    updatePost() {
        const posts = Post.loadPosts();
        const post = posts.find(post => post.id == this.id);

        if (!post) return false;

        post.title = this.title || post.title;
        post.content = this.content || post.content;
        post.image = this.image || post.image;
        post.updatedAt = new Date();

        Post.savePosts(posts);
        return true;
    }
}

export default Post;
