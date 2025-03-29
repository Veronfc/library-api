/** @format */

import express, { Request, Response } from "express";

import { UserController } from "../controllers/userController";
import { Auth } from "../auth/auth";

const router = express.Router();

//=REMOVE=WHEN=DONE=//
router.get("/", async (res: Response) => {
	res.send(await UserController.getUsers());
});
//==================//

router.post("/", async (req: Request, res: Response) => {
	const result = await UserController.register(req);

	res
		.status(result.status)
		.setHeader("Authorization", result.token)
		.send(result.content);
});

router.get("/:id", Auth.checkToken, async (req: Request, res: Response) => {
	const result = await UserController.getUser(req);

	res.status(result.status).send(result.content);
});

router.put("/:id", Auth.checkToken, async (req: Request, res: Response) => {
	res.sendStatus(await UserController.update(req));
});

router.get(
	"/:id/books",
	Auth.checkToken,
	async (req: Request, res: Response) => {
		const result = await UserController.getBooks(req);

		res.status(result.status).send(result.content);
	}
);

router.post(
	"/:id/books/:bookId",
	Auth.checkToken,
	async (req: Request, res: Response) => {
		res.sendStatus(await UserController.borrow(req));
	}
);

router.delete(
	"/:id/books/:bookId",
	Auth.checkToken,
	async (req: Request, res: Response) => {
		res.sendStatus(await UserController.return(req));
	}
);

router.post("/login", async (req: Request, res: Response) => {
	const result = await UserController.login(req);

	res
		.status(result.status)
		.setHeader("Authorization", result.token)
		.send(result.content);
});

module.exports = router;
