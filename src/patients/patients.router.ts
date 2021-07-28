import express from "express";
const router = express.Router();

import {
  getPatientById,
  createPatient,
  updatePatient,
} from "./patients.controller";

router.get("/:patientid", getPatientById);
router.put("/:patientid", updatePatient);
router.post("/", createPatient);

export { router as patientRouter };
