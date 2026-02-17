import { type Request, type Response } from "express";
import Event from "../model/events";
import { AuthRequest } from "../middleware/authmiddleware";
import cloudinary from "../lib/cloudinary";

export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const organizerId = req.user?.id;
        const { title, description, date, location, category, time, price } = req.body;
        // Check if file is uploaded
        let imageUrl = "";
        if (req.file) {
            // Upload from buffer (memory storage) for serverless environments
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "events"
            });
            imageUrl = result.secure_url;
        }

        if (!organizerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newEvent = new Event({
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

        await newEvent.save();
        return res.status(201).json({ message: "Event created successfully", event: newEvent });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId, ...updates } = req.body;

        let imageUrl = "";
        if (req.file) {
            // Upload from buffer (memory storage) for serverless environments
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "events"
            });
            imageUrl = result.secure_url;
            // Add image URL to updates
            (updates as any).image = imageUrl;
        }

        const event = await Event.findByIdAndUpdate(eventId, updates, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event updated successfully", event });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const organizerAllEvents = async (req: AuthRequest, res: Response) => {
    try {
        const organizerId = req.user?.id;
        if (!organizerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const events = await Event.find({ organizer: organizerId });
        return res.status(200).json(events);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const organizerId = req.user?.id;
        if (!organizerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const events = await Event.find({ organizer: organizerId });

        const totalEvents = events.length;

        const totalRegistrations = events.reduce((acc, event: any) => {
            return acc + (event.resisteredUsers ? event.resisteredUsers.length : 0);
        }, 0);

        const now = new Date();
        const upcomingEvents = events.filter((event: any) => new Date(event.date) >= now).length;

        // Recent events (last 5 created)
        const recentEvents = await Event.find({ organizer: organizerId })
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            totalEvents,
            totalRegistrations,
            upcomingEvents,
            recentEvents
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}