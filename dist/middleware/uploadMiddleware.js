"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
// Use disk storage to temporarily save the file before uploading to Cloudinary
// Alternatively, we could use memory storage, but disk is safer for larger files
// For a serverless environment (like Vercel), memory storage is better.
// Assuming a standard Node environment here.
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp'); // Save to /tmp for serverless environments
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
exports.uploadMiddleware = upload.single('image');
