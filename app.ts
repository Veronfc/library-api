/** @format */

import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

import { Auth } from "./auth";
import { Query } from "./query";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const db = new PrismaClient();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.get("/users", async (req: Request, res: Response) => {
	res.send(await Query.getUsers());
});

app.post("/register", async (req: Request, res: Response) => {
  res.sendStatus(await Query.userRegister(req))
});

app.post("/login", async (req: Request, res: Response) => {
	const result = (await Query.userLogin(req));

	res.status(result == undefined ? 500 : result.status).send(result?.user);
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
