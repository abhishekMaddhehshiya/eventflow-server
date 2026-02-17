import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth';

import connectDB from './lib/db';
const port = 3000;

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true,
}))

connectDB();

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log("app is running at port: ", port);
})
