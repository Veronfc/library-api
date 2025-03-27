/** @format */

import express, { Request, Response, Application } from "express";

const users = require("./src/routes/userRoute");
const books = require("./src/routes/bookRoute");

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use("/users", users);
app.use("/books", books);

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
