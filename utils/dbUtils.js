import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

const dbPool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "community",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 연결 테스트 함수 (선택 사항, 초기화 시 확인 용도)
async function testConnection() {
    try {
        const connection = await dbPool.getConnection();
        console.log('Database connection successful');
        connection.release(); // 연결 반환
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // 연결 실패 시 애플리케이션 종료
    }
}

export { dbPool, testConnection };

