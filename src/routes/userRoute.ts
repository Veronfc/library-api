/** @format */

import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { UserController } from "../controllers/userController";

const router = express.Router();
const db = new PrismaClient();

router.get("/all", async (req: Request, res: Response) => {
  res.send(await UserController.getUsers(db))
})

router.post("/register", async (req: Request, res: Response) => {
	res.sendStatus(await UserController.register(req, db));
});

router.post("/login", async (req: Request, res: Response) => {
	const result = await UserController.login(req, db);

	res.status(result == undefined ? 500 : result.status).send(result == undefined ? "No Content" : result.content);
});

router.get("/:id", async (req: Request, res: Response) => {
  const result = await UserController.getUser(req, db)

  res.status(result == undefined ? 500 : result.status).send(result == undefined ? "No Content" : result.content);
})

router.get("/:id/books", async (req: Request, res: Response) => {
  const result = await UserController.getBooks(req, db)

  res.status(result == undefined ? 500 : result.status).send(result == undefined ? "No Content" : result.content);
})

module.exports = router;
