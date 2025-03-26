/** @format */

import { Prisma, PrismaClient } from "@prisma/client";
import { Request } from "express";

import { Encrypt } from "../auth/encrypt";

const db = new PrismaClient();

export class UserController {
	public static async getUsers() {
		const users = await db.user.findMany({
			omit: {
				password: true,
			},
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
					username: username,
				},
			});

			return { content: null, status: 409 };
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					const user = await db.user.create({
						data: {
							name: name,
							username: username,
							password: password,
						},
						omit: {
							password: true
						}
					});

					return { content: user, status: 201 };
				}
			}
		}
	}

	public static async login(req: Request) {
		const username: string = req.body.username;
		const password: string = req.body.password;

		try {
			const user = await db.user.findUniqueOrThrow({
				where: {
					username: username,
				},
			});

			if (await Encrypt.checkPassword(password, user.password)) {
				user.password = "";
				return { content: user, status: 200 };
			}

			return { content: null, status: 401 };
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return { content: null, status: 404 };
				}
			}
		}
	}

	public static async getUser(req: Request) {
		const id: number = parseInt(req.params.id);

		const user = await db.user.findUniqueOrThrow({
			where: {
				id: id,
			},
			omit: {
				password: true,
			},
		});

		return user;
	}

	public static async getBooks(req: Request) {
		const id: number = parseInt(req.params.id);

		const user = await db.user.findUniqueOrThrow({
			where: {
				id: id,
			},
			include: {
				booksBorrowed: true,
			},
			omit: {
				password: true,
			},
		});

		return user.booksBorrowed;
	}

	public static async updateDetails(req: Request) {
		const id: number = parseInt(req.params.id);
		const name = req.body.name;
		const username = req.body.username;
    const password = await Encrypt.hashPassword(req.body.password)

		await db.user.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				username: username,
        password: password
			},
			omit: {
				password: true,
			},
		});

		return 204
	}
}
