import { Request, Response, NextFunction } from "express";

export const catchAsync =
	(fn: Function) => (req: Request, res: Response, next: NextFunction) =>
		fn(req, req, next).catch(next);

class AppError extends Error {
	statuscode: number;
	isOperational: boolean;
	status: string;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statuscode = statusCode;
		this.isOperational = true;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
