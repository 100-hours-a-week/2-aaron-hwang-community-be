import connection from './db.js';
import bcrypt from 'bcrypt';

function login(email, password, callback) {
    console.log(email,password)
    const sql = `SELECT * FROM user WHERE email = ?`;
    
    connection.query(sql, email, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const isMatch = bcrypt.compareSync(password, results[0].password);
            if(isMatch){
                console.log(results)
                const user = results[0];
                callback(null, user);
            }
        } else {
            callback(null);
        }
    });
}

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

export { login, signup };
