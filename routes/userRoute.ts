/** @format */

import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { UserController } from "../controllers/userController";

const router = express.Router();
const db = new PrismaClient();

router.post("/register", async (req: Request, res: Response) => {
	res.sendStatus(await UserController.register(req, db));
});

router.post("/login", async (req: Request, res: Response) => {
	const result = await UserController.login(req, db);

	res.status(result == undefined ? 500 : result.status).send(result?.user);
});

module.exports = router;
