import express from "express"
import cors from "cors";
import knexConfig from "./knexfile.js"
import knex from "knex";
import dotenv from 'dotenv';
import morgan from "morgan"
import cookieParser from 'cookie-parser';
dotenv.config();

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';

const app = express();
const db = knex(knexConfig.development);
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // frontend URL
  credentials: true, 
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});