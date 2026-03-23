import { S3Client } from "@aws-sdk/client-s3";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// 1. Initialize the S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 2. S3 storage config
const storage = multerS3({
  s3,
  bucket: "aning-kabalen",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (_req, file, cb) => cb(null, { fieldName: file.fieldname }),
  key: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-listing-image/${uuidv4()}${ext}`);
  },
});

// 3. File type filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  cb(null, allowed.includes(file.mimetype));
};

// 4. Export multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB ?? '10') * 1024 * 1024 },
});