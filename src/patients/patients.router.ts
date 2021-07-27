import express from "express";
const router = express.Router();

import { getPatientById, createPatient } from "./patients.controller";

router.get("/:patientid", getPatientById);
router.post("/", createPatient);

export { router as patientRouter };
