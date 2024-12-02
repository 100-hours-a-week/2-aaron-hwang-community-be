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
