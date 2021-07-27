import express, { Request, Response } from "express";
const router = express.Router();

import { getCCCById, createCCC } from "./ccc.controller";

router.get("/:cccid", getCCCById);
router.post("/", createCCC);

export { router as cccRouter };
