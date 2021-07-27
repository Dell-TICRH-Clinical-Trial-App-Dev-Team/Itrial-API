import express, { Request, Response } from "express";
const router = express.Router();

import { cccRouter } from "./centralCoordinatingCenters/ccc.router";
import { trialRouter } from "./trials/trials.router";

router.use("/cccs", cccRouter);
router.use("/trials", trialRouter);

export { router as router };
