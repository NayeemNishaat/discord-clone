import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { AppError } from "./lib/error";
import { errorHandler } from "./controllers/errorController";

const app: Express = express();
app.use(express.json());
app.use(
	cors({
		// Important: Both frontend and backend requires "credentials: true" for sending and storing credentials. And origin shouldn't be wildcard!
		credentials: true,
		origin: "http://localhost:3000"
	})
);
// app.options("*", cors());

// Chapter: Mounting Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// Chapter: Handeling Unwanted Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	next(
		new AppError(`This (${req.originalUrl}) route is not available!`, 404)
	);
});

// Chapter: Handeling Error
app.use(errorHandler);

export default app;
