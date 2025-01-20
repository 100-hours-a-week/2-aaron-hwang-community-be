import path from 'path';

// 파일 이름 정규화 함수
const normalizeFileName = (originalName) => {
    const fileExt = path.extname(originalName); // 확장자 추출
    const baseName = path.basename(originalName, fileExt); // 확장자를 제외한 이름 추출

    // 한글 및 특수 문자 처리 (NFC normalization, 공백을 _로 대체)
    const normalizedBaseName = baseName.normalize("NFC").replace(/[^a-zA-Z0-9가-힣]/g, "_");

    // 정규화된 이름 반환
    return `${normalizedBaseName}${fileExt}`;
};

export {normalizeFileName}