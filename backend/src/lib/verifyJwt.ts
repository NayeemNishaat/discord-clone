import { AppError } from "../lib/error";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Namespace } from "socket.io";

interface JwtPayload {
	id: string;
	email: string;
}

declare const process: {
	env: {
		JWT_SECRET: string;
		JWT_EXPIRES_IN: string;
		JWT_COOKIE_EXPIRES_IN: number;
	};
};

export default async function verifyJwt(
	cookie: string | undefined,
	next: Namespace
) {
	let token;
	if (cookie) {
		cookie.split("; ").forEach((el) => {
			const arr = el.split("=");
			if (arr[0] === "jwt") token = arr[1];
		});
	}

	if (!token) return next(new AppError("Please log in to get access!", 401));

	const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

	const currentUser = await User.findById(decoded.id);

	if (!currentUser)
		return next(
			new AppError(
				"The user belonging to this token does no longer exist.",
				401
			)
		);

	req.user = currentUser;
	next();
}
