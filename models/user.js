import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import formatDate from '../middleware/formatDate.js';

const __dirname = path.resolve();

class User {
    constructor(email, password, username, profile_img, createdAt, updatedAt) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.profile_img = profile_img;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    static loadUsers() {
        const dataPath = path.join(__dirname,'.','public','data','users.json');
        const rawData = fs.readFileSync(dataPath);
        const users = JSON.parse(rawData).users;
        return users
    }

    static saveUser(users) {
        const dataPath = path.join(__dirname,'.','public','data','users.json');
        fs.writeFileSync(dataPath, JSON.stringify({users},null,2))
    }

    static async hashPassword(password) {
        const saltRounds = 10; // 암호화 강도(Not a thief)
        return await bcrypt.hash(password, saltRounds);
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }   

    static async login(email, password) {
        const users = this.loadUsers()
        const user = users.find(u => u.email === email);
        if (!user) {
            throw new Error('Invalid email');
        }

        const isMatch = await User.comparePassword(password, user.password);
        if(!isMatch) {
            throw new Error('invalid password')
        }
        return user;
    }

    async addUser() {
        const users = User.loadUsers();
        // 자동 증가 ID 설정
        const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
        const newId = maxId + 1;
        
        const hashedPassword = await User.hashPassword(this.password)
        users.push({ 
            id: newId, 
            email: this.email, 
            password: hashedPassword, 
            username: this.username, 
            profile_img: this.profile_img, 
            createdAt: formatDate(new Date()), 
            updatedAt: formatDate(new Date())
        });
        User.saveUser(users);
    }

    static updateUsername(user_id, newUsername) {
        const users = this.loadUsers();
        const user = users.find(user => user.id == user_id);

        if (!user) return false; // 유저가 존재하지 않을 때

        user.username = newUsername;
        user.updatedAt = formatDate(new Date());
        this.saveUser(users);
        return true;
    }

    static async updatePassword(user_id, password, newPassword) {
        const users = this.loadUsers();
        const user = users.find(user => user.id == user_id && user.password === password);

        if (!user) return false; // 유저가 존재하지 않을 때

        const hashedPassword = await this.hashPassword(newPassword);
        user.password = newPassword; // 비밀번호 암호화는 추후 추가
        user.updatedAt = formatDate(new Date());

        this.saveUser(users);
        return true;
    }

    static deleteUser(user_id) {
        let users = this.loadUsers();
        const userIndex = users.findIndex(user => user.id == user_id);

        if (userIndex === -1) {
            return false; // 유저가 존재하지 않을 때
        }

        users.splice(userIndex, 1); // 해당 유저 삭제
        this.saveUser(users);
        return true;
    }

    // TODO: 비밀번호 암호화
  }
  
export default User;