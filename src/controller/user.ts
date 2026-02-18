import { type Request, type Response } from "express";
import User from "../model/user";
import Event from "../model/events";
import { AuthRequest } from "../middleware/authmiddleware";

export const registerEvents = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (event.resisteredUsers.includes(userId as any)) {
            return res.status(400).json({ message: "User already registered for this event" });
        }

        event.resisteredUsers.push(userId as any);
        await event.save();

        user.events.push(eventId);
        await user.save();

        return res.status(200).json({ message: "Registered successfully", event });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find().populate("organizer", "name email");
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllRegisteredEvents = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).populate("events");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.events);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const cancelEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!event.resisteredUsers.includes(userId as any)) {
            return res.status(400).json({ message: "User is not registered for this event" });
        }

        // Remove user from event's registeredUsers
        event.resisteredUsers = event.resisteredUsers.filter((id) => id.toString() !== userId);
        await event.save();

        // Remove event from user's events
        user.events = user.events.filter((id) => id.toString() !== eventId);
        await user.save();

        return res.status(200).json({ message: "Event cancelled successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}