/** @format */

import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "SomeSuperSecretKey";

type Token = {
	id: number;
	name: string;
	username: string;
	password: string;
	role: Role;
	iat: number;
	exp: number;
};

export class Auth {
	public static async createToken(payload: any): Promise<string> {
		try {
			const token = jwt.sign(payload, secret, {
				expiresIn: "5m"
			});

			return token;
		} catch (err) {
			return "";
		}
	}

	public static checkToken = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const id: number = parseInt(req.params.id);
		const token = req.headers.authorization || "";

		try {
			const payload = jwt.verify(token, secret) as Token;

			if (payload.id == id) {
				next();
			} else res.sendStatus(401);
		} catch (err) {
			res.sendStatus(403);
		}
	};

	public static checkAdminToken = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const token = req.headers.authorization || "";

		try {
			const payload = jwt.verify(token, secret) as Token;

			if (payload.role == Role["Admin"]) {
				next();
			} else res.sendStatus(401);
		} catch (err) {
			res.sendStatus(403);
		}
	};
}
