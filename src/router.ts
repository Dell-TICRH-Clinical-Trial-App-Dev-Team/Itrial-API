import express, { Request, Response } from "express";
const router = express.Router();

import { cccRouter } from "./centralCoordinatingCenters/ccc.router";
import { trialRouter } from "./trials/trials.router";
import { endpointRouter } from "./endpoints/endpoints.router";
import { patientRouter } from "./patients/patients.router";

router.use("/cccs", cccRouter);
router.use("/trials", trialRouter);
router.use("/endpoints", endpointRouter);
router.use("/patients", patientRouter);

export { router as router };
