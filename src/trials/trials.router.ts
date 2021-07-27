import express, { Request, Response } from "express";
const router = express.Router();

import { getTrialById, createTrial } from "./trials.controller";

router.get("/:trialid", getTrialById);
router.post("/", createTrial);

export { router as trialRouter };
