/** @format */

import express, { Request, Response, Application } from "express";

const users = require('./routes/userRoute')
const books = require('./routes/bookRoute')

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/user', users)
app.use('/books', books)

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
