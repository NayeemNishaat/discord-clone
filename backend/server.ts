import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

const PORT: String = process.env.PORT || process.env.API_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
