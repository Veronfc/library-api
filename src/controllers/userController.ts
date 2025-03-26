/** @format */

import { Prisma, PrismaClient } from "@prisma/client";
import { Request } from "express";

import { Encrypt } from "../auth/encrypt";

export class UserController {
	public static async getUsers(db: PrismaClient) {
		const users = await db.user.findMany({
			omit: {
				password: true
			}
		});
		return users;
	}

	public static async register(req: Request, db: PrismaClient) {
		const name: string = req.body.name;
		const username: string = req.body.username;
		const password: string = await Encrypt.hashPassword(req.body.password);

		try {
			const user = await db.user.findUniqueOrThrow({
				where: {
					username: username
				}
			});

			return 409;
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					await db.user.create({
						data: {
							name: name,
							username: username,
							password: password
						}
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
					username: username
				}
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

  public static async getUser(req: Request, db: PrismaClient) {
    const id: number = parseInt(req.params.id);

    try {
      const user = await db.user.findUniqueOrThrow({
        where: {
          id: id
        },
        omit: {
          password: true
        }
      })

      return { content: user, status: 200}
    } catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return { content: null, status: 404 };
				}
			}
		}
  }

	public static async getBooks(req: Request, db: PrismaClient) {
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
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					return { content: null, status: 404 };
				}
			}
		}
	}
}
