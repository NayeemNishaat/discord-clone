import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { AppError } from "./lib/error";
import { errorHandler } from "./controllers/errorController";

const app: Express = express();
app.use(express.json());
app.use(cors());

// Chapter: Mounting Routes
app.use("/api/v1/auth", authRoutes);

// Chapter: Handeling Unwanted Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	next(
		new AppError(`This (${req.originalUrl}) route is not available!`, 404)
	);
});

// Chapter: Handeling Error
app.use(errorHandler);

export default app;
