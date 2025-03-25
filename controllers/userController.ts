/** @format */

import { Prisma, PrismaClient } from "@prisma/client";
import { Request } from "express";

import { Auth } from "../auth";

export class UserController {
	public static async register(req: Request, db: PrismaClient): Promise<number> {
		const name: string = req.body.name;
		const username: string = req.body.username;
		const password: string = await Auth.hashPassword(req.body.password);

		try {
			const user = await db.user.findUniqueOrThrow({
				where: {
					username: username,
				},
			});

			return 409;
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					await db.user.create({
						data: {
							name: name,
							username: username,
							password: password,
						},
					});
				}
			}
		}

		return 201;
	}

	public static async login(req: Request, db: PrismaClient) {
		const username: string = req.body.username;
		const password: string = req.body.password;

		try {
			const user = await db.user.findUniqueOrThrow({
				where: {
					username: username,
				},
			});

			if (await Auth.checkPassword(password, user.password)) {
				return { user: user, status: 200 };
			}

			return { user: null, status: 401 };
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return { user: null, status: 404 };
				}
			}
		}
	}
}
