import { Request, Response, NextFunction } from "express";

export const catchAsync =
	(fn: Function) => (req: Request, res: Response, next: NextFunction) =>
		fn(req, res, next).catch(next);

export class AppError extends Error {
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
