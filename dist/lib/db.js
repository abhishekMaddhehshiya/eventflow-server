"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => {
    mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/event-management", {}).then(() => {
        console.log("db connect successfully");
    }).catch((err) => {
        console.log("db connection failed");
        console.error(err);
        process.exit(1);
    });
};
exports.default = connectDB;
