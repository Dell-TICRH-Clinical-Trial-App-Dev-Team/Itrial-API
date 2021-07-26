import express, { Request, Response } from "express";
const router = express.Router();

import { getCCCById, createCCC } from "./ccc.controller";

router.get("/status", (req: Request, res: Response) => {
  res.send("lmao");
});
router.get("/:cccid", getCCCById);
router.post("/", createCCC);

export { router as cccRouter };
