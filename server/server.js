import express from "express"
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import morgan from "morgan"
import cookieParser from 'cookie-parser';

import { connectDB } from "./db/db.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from './routes/auth.js';
import clientsRoutes from './routes/clients.js';
import ticketsRoutes from './routes/tickets.js';

const app = express();
const PORT = process.env.PORT || 5000

connectDB();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' || 'https://amp-csrportal.onrender.com', // frontend URL
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);

app.use('/api/clients', clientsRoutes);
app.use('/api/tickets', ticketsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});