import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { BookController } from "../controllers/userController";

const router = express.Router()

module.exports = router