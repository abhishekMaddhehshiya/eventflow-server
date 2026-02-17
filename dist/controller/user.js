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
exports.getAllRegisteredEvents = exports.getAllEvents = exports.registerEvents = void 0;
const user_1 = __importDefault(require("../model/user"));
const events_1 = __importDefault(require("../model/events"));
const registerEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { eventId } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const event = yield events_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (event.resisteredUsers.includes(userId)) {
            return res.status(400).json({ message: "User already registered for this event" });
        }
        event.resisteredUsers.push(userId);
        yield event.save();
        user.events.push(eventId);
        yield user.save();
        return res.status(200).json({ message: "Registered successfully", event });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.registerEvents = registerEvents;
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield events_1.default.find().populate("organizer", "name email");
        return res.status(200).json(events);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllEvents = getAllEvents;
const getAllRegisteredEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findById(userId).populate("events");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user.events);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllRegisteredEvents = getAllRegisteredEvents;
