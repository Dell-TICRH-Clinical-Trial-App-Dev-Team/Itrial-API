import express from "express";
const router = express.Router();

import { get, create, update } from "./trials.controller";

router.get("/:trialid", get);
router.put("/:trialid", update);
router.post("/", create);

export { router as trialRouter };
