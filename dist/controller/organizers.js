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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.deleteEvent = exports.organizerAllEvents = exports.updateEvent = exports.createEvent = void 0;
const events_1 = __importDefault(require("../model/events"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const organizerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { title, description, date, location, category, time, price } = req.body;
        // Check if file is uploaded
        let imageUrl = "";
        if (req.file) {
            // Upload from buffer (memory storage) for serverless environments
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const result = yield cloudinary_1.default.uploader.upload(dataURI, {
                folder: "events"
            });
            imageUrl = result.secure_url;
        }
        if (!organizerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newEvent = new events_1.default({
            title,
            description,
            date,
            location,
            organizer: organizerId,
            category,
            time,
            price,
            image: imageUrl,
            resisteredUsers: []
        });
        yield newEvent.save();
        return res.status(201).json({ message: "Event created successfully", event: newEvent });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createEvent = createEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { eventId } = _a, updates = __rest(_a, ["eventId"]);
        let imageUrl = "";
        if (req.file) {
            // Upload from buffer (memory storage) for serverless environments
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const result = yield cloudinary_1.default.uploader.upload(dataURI, {
                folder: "events"
            });
            imageUrl = result.secure_url;
            // Add image URL to updates
            updates.image = imageUrl;
        }
        const event = yield events_1.default.findByIdAndUpdate(eventId, updates, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event updated successfully", event });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateEvent = updateEvent;
const organizerAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const organizerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!organizerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const events = yield events_1.default.find({ organizer: organizerId });
        return res.status(200).json(events);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.organizerAllEvents = organizerAllEvents;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield events_1.default.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteEvent = deleteEvent;
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const organizerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!organizerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const events = yield events_1.default.find({ organizer: organizerId });
        const totalEvents = events.length;
        const totalRegistrations = events.reduce((acc, event) => {
            return acc + (event.resisteredUsers ? event.resisteredUsers.length : 0);
        }, 0);
        const now = new Date();
        const upcomingEvents = events.filter((event) => new Date(event.date) >= now).length;
        // Recent events (last 5 created)
        const recentEvents = yield events_1.default.find({ organizer: organizerId })
            .sort({ createdAt: -1 })
            .limit(5);
        return res.status(200).json({
            totalEvents,
            totalRegistrations,
            upcomingEvents,
            recentEvents
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getDashboardStats = getDashboardStats;
