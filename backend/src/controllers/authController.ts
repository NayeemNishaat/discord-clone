import { Request, Response, NextFunction } from "express";

export const register = (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send("Register Route");
};

export const login = (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send("Login Route");
};
