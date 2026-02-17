import { Router } from 'express'
import { authMiddleware, isUser } from '../middleware/authmiddleware.ts';
import { getAllEvents, getAllRegisteredEvents, registerEvents } from '../controller/user.ts';


const userRoutes = Router();
userRoutes.use(authMiddleware, isUser);


userRoutes.post("/register-event", registerEvents);
userRoutes.get("/get-all-events", getAllEvents);
userRoutes.get("/get-registered-event", getAllRegisteredEvents);

export default userRoutes;