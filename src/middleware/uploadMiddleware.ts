import multer from 'multer';
import { type Request, type Response, type NextFunction } from 'express';

// Use disk storage to temporarily save the file before uploading to Cloudinary
// Alternatively, we could use memory storage, but disk is safer for larger files
// For a serverless environment (like Vercel), memory storage is better.
// Assuming a standard Node environment here.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './'); // Save to root or a temp folder. Ensure this exists or use /tmp
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single('image');
