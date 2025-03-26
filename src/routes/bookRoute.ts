import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { BookController } from "../controllers/bookController";

const router = express.Router()

//code here

module.exports = router