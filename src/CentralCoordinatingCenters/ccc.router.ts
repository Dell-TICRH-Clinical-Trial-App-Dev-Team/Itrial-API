import express from "express";
const router = express.Router();

import { getCCCById, createCCC, updateCCC } from "./ccc.controller";

router.get("/:cccid", getCCCById);
router.put("/:cccid", updateCCC);
router.post("/", createCCC);

export { router as cccRouter };
