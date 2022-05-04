import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

try {
	const connection = await mongoose.connect(process.env.MONGO_URI);

	if (!connection) throw new Error("Failed to connect with DB and Server!");

	const PORT: String = process.env.PORT || process.env.API_PORT;
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} catch (err) {
	console.log(err);
}
