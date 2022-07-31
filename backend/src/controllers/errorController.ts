import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/error";

interface IError extends AppError {
	_message?: string;
	errors?: object;
}

const sendError = (err: IError, req: Request, res: Response, env: string) => {
	if (env === "development") {
		console.log(err);

		return res.status(err.statuscode).json({
			status: err.status,
			message: err.message
		});
	}

	if (err.isOperational) {
		return res.status(err.statuscode).json({
			status: err.status,
			message: err.message
		});
	}

	return res.status(err.statuscode).json({
		status: err.status,
		message: "Something went wrong! Please try again later!"
	});
};

const handleValidationErrorDB = (err: IError) => {
	const errors: string[] | undefined =
		err.errors &&
		Object.values(err.errors).map((ob: { message: string }) => ob.message);

	const message: string = `Invalid input data. ${errors?.join(" ")}`;

	return new AppError(message, 400);
};

const handleJWTError = (err: IError) => {
	return new AppError("Invalid Token!", 401);
};

export const errorHandler = (
	err: IError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statuscode = err.statuscode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendError(err, req, res, "development");
	} else {
		let error = { ...err };
		error.message = err.message;

		if (error._message === "User validation failed")
			error = handleValidationErrorDB(error);

		if (
			error.name === "JsonWebTokenError" ||
			error.name === "TokenExpiredError"
		)
			error = handleJWTError(error);

		sendError(error, req, res, "production");
	}
};
