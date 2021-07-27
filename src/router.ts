import express, { Request, Response } from "express";
const router = express.Router();

import { cccRouter } from "./centralCoordinatingCenters/ccc.router";
import { trialRouter } from "./trials/trials.router";
import { endpointRouter } from "./endpoints/endpoints.router";

router.use("/cccs", cccRouter);
router.use("/trials", trialRouter);
router.use("/endpoints", endpointRouter);

export { router as router };
