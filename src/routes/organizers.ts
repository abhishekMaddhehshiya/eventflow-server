import { Router } from 'express'
import { authMiddleware, isOrganizer } from '../middleware/authmiddleware.ts';
import { createEvent, deleteEvent, organizerAllEvents, updateEvent, getDashboardStats } from '../controller/organizers.ts';
import { uploadMiddleware } from '../middleware/uploadMiddleware.ts';


const organizerRoutes = Router();
organizerRoutes.use(authMiddleware, isOrganizer);


organizerRoutes.post("/create-event", uploadMiddleware, createEvent);
organizerRoutes.put("/update-event", uploadMiddleware, updateEvent);
organizerRoutes.delete("/delete-event/:id", deleteEvent);
organizerRoutes.get("/organizer-all-events", organizerAllEvents);
organizerRoutes.get("/dashboard", getDashboardStats);



export default organizerRoutes