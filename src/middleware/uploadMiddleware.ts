import multer from 'multer';
import { type Request, type Response, type NextFunction } from 'express';

// Use memory storage for serverless environments like Vercel
// Files are stored in memory as Buffer objects, which works better in serverless
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export const uploadMiddleware = upload.single('image');
