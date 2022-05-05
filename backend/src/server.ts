import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes";

const app: Express = express();
app.use(express.json());
app.use(cors());

// Chapter: Mounting Routes
app.use("/api/v1/auth", authRoutes);

// Chapter: DB and Server Connection
declare const process: {
	env: {
		MONGO_URI: string;
		API_PORT: string;
		PORT: string;
	};
};

try {
	(async () => {
		const connection = await mongoose.connect(process.env.MONGO_URI);
		if (!connection)
			throw new Error("Failed to connect with DB and Server!");
	})();
} catch (err) {
	console.log(err);
}

const PORT: String = process.env.PORT || process.env.API_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
