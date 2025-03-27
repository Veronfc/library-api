/** @format */

import express, { Request, Response } from "express";

import { BookController } from "../controllers/bookController";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	res.send(await BookController.getBooks());
});

router.post("/", async (req: Request, res: Response) => {
	res.sendStatus(await BookController.add(req));
});

router.get("/:id", async (req: Request, res: Response) => {
	const result = await BookController.getBook(req);

	res.send(result.content).status(result.status);
});

router.put("/:id", async (req: Request, res: Response) => {
	res.sendStatus(await BookController.update(req));
});

module.exports = router;
