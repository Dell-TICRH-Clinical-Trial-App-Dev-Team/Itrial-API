import { Request, Response } from "express";
import { Patient } from "./patients.model";

export async function getPatientById(req: Request, res: Response) {
  Patient.findById(req.params.patientid).exec((err, ccc) => {
    res.status(200).json(ccc);
  });
}

export async function createPatient(req: Request, res: Response) {
  const {
    dccid,
    name,
    address,
    email,
    phoneNumber,
    consentForm,
    screenFail,
    documents,
    endpoints,
    group,
    site,
    trial,
  } = req.body;

  const patient = Patient.build({
    dccid,
    name,
    address,
    email,
    phoneNumber,
    consentForm,
    screenFail,
    documents,
    endpoints,
    group,
    site,
    trial,
  });

  await patient.save();
  return res.status(201).json(patient);
}
