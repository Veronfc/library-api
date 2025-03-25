/** @format */

import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";
import { PrismaClient } from "@prisma/client";

import { Auth } from "./auth";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const db = new PrismaClient();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.get("/users", async (req: Request, res: Response) => {
	const users = await db.user.findMany();
	res.send(users);
});

app.post("/register", async (req: Request, res: Response) => {
	const name: string = req.body.name;
	const username: string = req.body.username;
	const password: string = await Auth.hashPassword(req.body.password);

	await db.user.create({
		data: {
			name: name,
			username: username,
			password: password,
		},
	});

	res.sendStatus(201);
});

app.post("/login", async (req: Request, res: Response) => {
	const username: string = req.body.username;
	const password: string = req.body.password;

	const user = await db.user.findUniqueOrThrow({
		where: {
			username: username,
		},
	});

	if (await Auth.checkPassword(password, user.password)) {
		res.send(user);
	}

	res.status(401);
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
