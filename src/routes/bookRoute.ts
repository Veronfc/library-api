/** @format */

import express, { Request, Response } from "express";

import { BookController } from "../controllers/bookController";
import { Auth } from "../auth/auth";

const router = express.Router();

router.get("/", async (res: Response) => {
	res.send(await BookController.getBooks());
});

router.post("/", Auth.checkAdminToken, async (req: Request, res: Response) => {
	res.sendStatus(await BookController.add(req));
});

router.get("/:id", async (req: Request, res: Response) => {
	const result = await BookController.getBook(req);

	res.status(result.status).send(result.content);
});

router.put(
	"/:id",
	Auth.checkAdminToken,
	async (req: Request, res: Response) => {
		res.sendStatus(await BookController.update(req));
	}
);

module.exports = router;
