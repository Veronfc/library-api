/** @format */

import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";
import { PrismaClient } from "@prisma/client";

import { UserController } from "./controllers/userController";

const users = require('./routes/userRoute')
const books = require('./routes/bookRoute')

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const db = new PrismaClient();

app.use(express.urlencoded({ extended: true }));
app.use('/user', users)
app.use('/books', books)

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.get("/users", async (req: Request, res: Response) => {
	res.send(await UserController.getUsers(db));
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
