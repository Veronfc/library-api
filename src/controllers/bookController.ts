/** @format */

import { Genre, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request } from "express";

const db = new PrismaClient();

export class BookController {
	public static async getBooks() {
		const books = await db.book.findMany();

		return books;
	}

	public static async add(req: Request) {
		const title: string = req.body.title;
		const genre: Genre = req.body.genre;
		const author: string = req.body.author;
		const publisher: string = req.body.publisher;
		const pages: number = parseInt(req.body.pages as string);
		const synopsis: string = req.body.synopsis;
		const count: number = parseInt(req.body.count as string);

		try {
			const book = await db.book.findUniqueOrThrow({
				where: {
					title: title
				}
			});

			return 409;
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					await db.book.create({
						data: {
							title: title,
							genre: genre,
							author: author,
							publisher: publisher,
							pages: pages,
							synopsis: synopsis,
							count: count
						}
					});

					return 201;
				}
			}
		}

		return 418;
	}

	public static async getBook(req: Request) {
		const id: number = parseInt(req.params.id);

		try {
			const book = await db.book.findUniqueOrThrow({
				where: {
					id: id
				}
			});

			return { content: book, status: 200 };
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
		const title: string = req.body.title;
		const genre: Genre = req.body.genre;
		const author: string = req.body.author;
		const publisher: string = req.body.publisher;
		const pages: number = parseInt(req.body.pages as string);
		const synopsis: string = req.body.synopsis;
		const count: number = parseInt(req.body.count as string);

		try {
			await db.book.update({
				where: {
					id: id
				},
				data: {
					title: title,
					genre: genre,
					author: author,
					publisher: publisher,
					pages: pages,
					synopsis: synopsis,
					count: count
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
}
