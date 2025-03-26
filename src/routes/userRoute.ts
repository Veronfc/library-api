/** @format */

import express, { Request, Response } from "express";

import { UserController } from "../controllers/userController";

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
  res.send(await UserController.getUsers())
})

router.post("/register", async (req: Request, res: Response) => {
  const result = await UserController.register(req);

  res.status(result == undefined ? 500 : result.status).send(result == undefined ? "No Content" : result.content);
});

router.post("/login", async (req: Request, res: Response) => {
	const result = await UserController.login(req);

	res.status(result == undefined ? 500 : result.status).send(result == undefined ? "No Content" : result.content);
});

router.get("/:id", async (req: Request, res: Response) => {
  res.send(await UserController.getUser(req));
})

router.get("/:id/books", async (req: Request, res: Response) => {
  res.send(await UserController.getBooks(req));
})

router.post('/:id/update', async (req: Request, res: Response) => {
  res.send(await UserController.updateDetails(req))
})

module.exports = router;