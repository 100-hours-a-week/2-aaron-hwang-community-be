import { loadJSON, saveJSON } from '../utils/fsUtils.js';
import formatDate from '../utils/dateUtils.js';
import bcrypt from 'bcrypt';

class User {
    constructor(id, email, password, username, profile_img, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.profile_img = profile_img || '';
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    static loadUsers() {
        return loadJSON('users.json').users;
    }

    static saveUser(users) {
        saveJSON('users.json', { users })
    }

    static findById(id) {
        const users = this.loadUsers();
        return users.find(user => user.id == id);
    }

    static findByEmail(email) {
        const users = this.loadUsers();
        return users.find(user => user.email === email);
    }

    static async hashPassword(password) {
        const saltRounds = 10; // 암호화 강도(Not a thief)
        return await bcrypt.hash(password, saltRounds);
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }   

    static async login(email, password) {
        const user = this.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error('invalid password')
        }

        return user;
    }

    async addUser() {
        const users = User.loadUsers();

        // 중복 이메일 확인
        if (users.some(user => user.email === this.email)) {
            throw new Error("이미 사용 중인 이메일입니다.");
        }

        const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
        
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(this.password, 10);

        const newUser = {
            id: newId, 
            email: this.email, 
            password: hashedPassword, 
            username: this.username, 
            profile_img: this.profile_img, 
            createdAt: this.createdAt, 
            updatedAt: this.updatedAt
        }

        users.push(newUser);
        User.saveUser(users);
    }

    static updateUsername(id, newUsername) {
        const users = this.loadUsers();
        const user = users.find(u => u.id === id);

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

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error('invalid password')
        }

        user.password = await bcrypt.hash(newPassword, 10); // 비밀번호 암호화는 추후 추가
        user.updatedAt = formatDate(new Date());

        this.saveUser(users);
        return true;
    }

    static deleteUser(user_id) {
        let users = this.loadUsers();
        const userIndex = users.findIndex(user => user.id == user_id);

        if (userIndex === -1) return false; // 유저가 존재하지 않을 때

        users.splice(userIndex, 1); // 해당 유저 삭제
        this.saveUser(users);
        return true;
    }
}
  
export default User;