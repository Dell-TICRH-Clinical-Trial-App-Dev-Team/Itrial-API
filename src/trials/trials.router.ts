import express from "express";
const router = express.Router();

import { getTrialById, createTrial, updateTrial } from "./trials.controller";

router.get("/:trialid", getTrialById);
router.put("/:trialid", updateTrial);
router.post("/", createTrial);

export { router as trialRouter };
