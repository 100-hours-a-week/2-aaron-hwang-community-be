import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { normalizeFileName } from '../utils/normalizeFileName.js'
import dotenv from 'dotenv';

dotenv.config();

// S3 클라이언트 생성
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer 설정
const storage = multer.memoryStorage(); // 메모리에서 파일 처리
const upload = multer({ storage });

// S3 업로드 함수
const uploadFileToS3 = async (file) => {
  const normalizedFileName = normalizeFileName(file.originalname);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME, // S3 버킷 이름
    Key: `uploads/${Date.now()}-${normalizedFileName}`, // 업로드 파일 경로 및 이름
    Body: file.buffer, // 파일 내용
    ContentType: file.mimetype, // 파일의 MIME 타입
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

// S3 파일 삭제 함수
const deleteFileFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey, // S3에서 삭제할 파일 경로
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`File deleted successfully: ${fileKey}`);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};

export { upload, uploadFileToS3, deleteFileFromS3 };
