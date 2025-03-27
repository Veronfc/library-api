/** @format */

import express, { Request, Response } from "express";

import { UserController } from "../controllers/userController";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	res.send(await UserController.getUsers());
});

router.post("/", async (req: Request, res: Response) => {
	const result = await UserController.register(req);

	res.status(result.status).setHeader("Authorization", result.token).send(result.content);
});

router.get("/:id", async (req: Request, res: Response) => {
	const result = await UserController.getUser(req);

	res.status(result.status).send(result.content);
});

router.put("/:id", async (req: Request, res: Response) => {
	res.sendStatus(await UserController.update(req));
});

router.get("/:id/books", async (req: Request, res: Response) => {
	const result = await UserController.getBooks(req);

	res.status(result.status).send(result.content);
});

router.post("/login", async (req: Request, res: Response) => {
	const result = await UserController.login(req);

	res.status(result.status).setHeader("Authorization", result.token).send(result.content);
});

module.exports = router;
