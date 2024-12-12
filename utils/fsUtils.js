import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

export function loadJSON(fileName) {
    const filePath = path.join(__dirname, 'public', 'data', fileName);
    if (!fs.existsSync(filePath)) throw new Error(`${fileName} 파일을 찾을 수 없습니다.`);
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}

export function saveJSON(fileName, data) {
    const filePath = path.join(__dirname, 'public', 'data', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 바이너리 파일 저장
export function saveBinaryFile(fileName, buffer) {
    const uploadDir = path.join(__dirname, 'public', 'images');
    
    // 업로드 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    return filePath; // 저장된 파일 경로 반환
}

// 바이너리 파일 로드
export function loadBinaryFile(fileName) {
    const filePath = path.join(__dirname, 'public', 'images', fileName);
    if (!fs.existsSync(filePath)) throw new Error(`${fileName} 파일을 찾을 수 없습니다.`);
    return fs.readFileSync(filePath); // 바이너리 데이터 반환
}