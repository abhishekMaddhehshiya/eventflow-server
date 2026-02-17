"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_1.default.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const verify = yield bcrypt_1.default.compare(password, user.password);
        if (!verify) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        return res.status(201).json({
            success: true,
            message: "Signed in",
            user,
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.loginUser = loginUser;
