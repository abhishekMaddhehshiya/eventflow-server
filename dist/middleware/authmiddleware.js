"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = exports.isOrganizer = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
const isOrganizer = (req, res, next) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "this route is protected for organizers only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Organizer role can not be verified",
        });
    }
};
exports.isOrganizer = isOrganizer;
const isUser = (req, res, next) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "user") {
            return res.status(403).json({
                success: false,
                message: "this route is protected for users only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified",
        });
    }
};
exports.isUser = isUser;
