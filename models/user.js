import connection from './db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

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
        fs.writeFileSync(dataPath, JSON.stringify(users,null,2))
    }
    // 이메일과 비밀번호로 로그인 검증하는 메서드
    static login(email, password) {
        const users = this.loadUsers()
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
        throw new Error('Invalid email or password');
        }
        return user;
    }

    addUser() {
        const users = User.loadUsers();
        // 자동 증가 ID 설정
        console.log(users)
        const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
        const newId = maxId + 1;

        users.push({ id: newId, email: this.email, password: this.password, username: this.username, profile_img: this.profile_img, createdAt: new Date(), updatedAt: new Date() });
        User.saveUser(users);
    }

    // 사용자 정보 업데이트
    updateProfile(img, username) {
      this.profile_img = img;
      this.username = username;
      this.updatedAt = new Date();
    }

    // TODO: 비밀번호 암호화, 비밀번호 변경, 회원가입, 비밀번호 업데이트,
  }
  
  export default User;
  
/*
function formatDate(timestamp) {
    const date = new Date(timestamp);

    // 연도, 월, 일
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // 1월은 0부터 시작하므로 +1
    const day = `0${date.getDate()}`.slice(-2);

    // 시, 분, 초
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);

    // 최종 포맷 yyyy-mm-dd hh:mm:ss
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function signup(email, password, profile_img, username, callback) {
    const sql = 'INSERT INTO user (email, password, profile_img, username, created_at) VALUES (?, ?, ?, ?, ?)';
    try {
        // 비밀번호 암호화
        const hashedPassword = bcrypt.hashSync(password, 10);

        // 사용자 정보 저장
        const user = { email, password: hashedPassword, profile_img, username };
        // user.push(user);
        console.log(`원본 비밀번호: ${password}`);
        console.log(`암호화된 비밀번호: ${hashedPassword}`);
        connection.query(sql, [email, hashedPassword, profile_img, username, formatDate(Date.now())], (err, result) => {
            if (err) throw err;
            callback(null, result); // 성공 시 삽입 결과 반환
        });
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
    }
    
}
*/
export { User };
