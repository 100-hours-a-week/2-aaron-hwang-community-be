import bcrypt from 'bcrypt';
import formatDate from '../utils/dateUtils.js';
import { dbPool } from '../utils/dbUtils.js';

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
    
    static async loadUsers() {
        const query = 'SELECT * FROM users';
        const [rows] = await dbPool.execute(query);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await dbPool.execute(query, [id]);
        return rows[0] || null;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await dbPool.execute(query, [email]);
        return rows[0] || null;
    }

    static async login(email, password) {
        const user = await this.findByEmail(email);
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
        const existingUser = await User.findByEmail(this.email);
        if (existingUser) {
            throw new Error('이미 사용 중인 이메일입니다.');
        }
 
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(this.password, 10);
        const query = `
            INSERT INTO users (email, password, username, profile_img, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await dbPool.execute(query, [
            this.email,
            hashedPassword,
            this.username,
            this.profile_img,
            formatDate(new Date()),
            formatDate(new Date()),
        ]);

        return result.insertId;
    }

    static async updateUsername(id, newUsername) {
        const existingUser = await User.findById(id);

        if (!existingUser) return false; // 유저가 존재하지 않을 때

        const query = `
            UPDATE users
            SET username = ?, updated_at = ?
            WHERE id = ?
        `;
        const [result] = await dbPool.execute(query, [
            newUsername,
            formatDate(new Date()),
            id,
        ]);
        return result.affectedRows > 0;
    }

    static async updatePassword(user_id, password, newPassword) {
        const user = await User.findById(user_id);

        if (!user) return false; // 유저가 존재하지 않을 때

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error('invalid password')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // 비밀번호 암호화는 추후 추가
        user.updatedAt = formatDate(new Date());

        const query = `
            UPDATE users
            SET password = ?, updated_at = ?
            WHERE id = ?
        `;
        const [result] = await dbPool.execute(query, [
            hashedPassword,
            formatDate(new Date()),
            id,
        ]);
        return result.affectedRows > 0;
    }

    static async deleteUser(user_id) {
        const user = await User.findById(id);

        if (!user) return false; // 유저가 존재하지 않을 때

        const query = `
            DELETE FROM users
            WHERE id = ?
        `;
        const [result] = await dbPool.execute(query, [id]);
        return result.affectedRows > 0;
    }
}
  
export default User;