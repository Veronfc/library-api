/** @format */

import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import jwt from "jsonwebtoken";

import { Encrypt } from "../auth/encrypt";

const db = new PrismaClient();

export class UserController {
	public static async getUsers() {
		const users = await db.user.findMany({
			omit: {
				password: true
			}
		});
		return users;
	}

	public static async register(req: Request) {
		const name: string = req.body.name;
		const username: string = req.body.username;
		const password: string = await Encrypt.hashPassword(req.body.password);

		try {
			const user = await db.user.findUniqueOrThrow({
				where: {
					username: username
				}
			});

			return { content: null, token: "", status: 409 };
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					const user = await db.user.create({
						data: {
							name: name,
							username: username,
							password: password
						},
						omit: {
							password: true
						}
					});

					const secret =
						process.env.JWT_SECRET == undefined
							? "SomeSuperSecretKey"
							: process.env.JWT_SECRET;

					const token = jwt.sign(user, secret, {
						expiresIn: "1m"
					});

					return { content: user, token: token, status: 201 };
				}
			}
		}

		return { content: null, token: "", status: 418 };
	}

	public static async getUser(req: Request) {
		const id: number = parseInt(req.params.id);

		try {
			const user = await db.user.findUnique({
				where: {
					id: id
				},
				omit: {
					password: true
				}
			});

			return { content: user, status: 200 };
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return { content: null, status: 404 };
				}
			}
		}

		return { content: null, status: 418 };
	}

	public static async update(req: Request) {
		const id: number = parseInt(req.params.id);
		const name: string = req.body.name;
		const username: string = req.body.username;
		const password: string = await Encrypt.hashPassword(req.body.password);

		try {
			await db.user.update({
				where: {
					id: id
				},
				data: {
					name: name,
					username: username,
					password: password
				}
			});

			return 204;
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return 404;
				}
			}
		}

		return 418;
	}

	public static async getBooks(req: Request) {
		const id: number = parseInt(req.params.id);

		try {
			const user = await db.user.findUniqueOrThrow({
				where: {
					id: id
				},
				include: {
					booksBorrowed: true
				},
				omit: {
					password: true
				}
			});

			return { content: user.booksBorrowed, status: 200 };
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return { content: null, status: 404 };
				}
			}
		}

		return { content: null, status: 418 };
	}

	public static async login(req: Request) {
		const username: string = req.body.username;
		const password: string = req.body.password;

		try {
			const user = await db.user.findUniqueOrThrow({
				where: {
					username: username
				}
			});

			if (await Encrypt.checkPassword(password, user.password)) {
				user.password = "";

				const secret =
					process.env.JWT_SECRET == undefined
						? "SomeSuperSecretKey"
						: process.env.JWT_SECRET;

				const token = jwt.sign(user, secret, {
					expiresIn: "1m"
				});

				return { content: user, token: token, status: 200 };
			}

			return { content: null, token: "", status: 401 };
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return { content: null, token: "", status: 404 };
				}
			}
		}

		return { content: null, token: "", status: 418 };
	}

	public static async jwtTest(req: Request) {
		const token = req.body.token;
		const secret =
			process.env.JWT_SECRET == undefined
				? "SomeSuperSecretKey"
				: process.env.JWT_SECRET;

		const decoded =
			jwt.verify(token, secret) == undefined || null
				? "it no work"
				: jwt.verify(token, secret);

		return decoded;
	}
}
