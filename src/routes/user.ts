import { Router } from 'express'
import { authMiddleware, isUser } from '../middleware/authmiddleware';
import { getAllEvents, getAllRegisteredEvents, registerEvents, cancelEvent } from '../controller/user';


const userRoutes = Router();
userRoutes.use(authMiddleware, isUser);


userRoutes.post("/register-event", registerEvents);
userRoutes.get("/get-all-events", getAllEvents);
userRoutes.get("/get-registered-event", getAllRegisteredEvents);
userRoutes.post("/cancel-event", cancelEvent);

export default userRoutes;