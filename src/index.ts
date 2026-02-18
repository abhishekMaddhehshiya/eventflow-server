import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth';

import connectDB from './lib/db';
import userRoutes from './routes/user';
import organizerRoutes from './routes/organizers';
const port = 3000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://event-management-theta-self.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/organizer", organizerRoutes);

app.listen(port, () => {
  console.log("app is running at port: ", port);
})
