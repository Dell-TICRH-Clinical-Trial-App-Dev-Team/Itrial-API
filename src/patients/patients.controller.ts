import { Request, Response } from "express";
import {
  getPatientById,
  createPatient,
  updatePatient,
} from "./patients.service";

export async function get(req: Request, res: Response) {
  getPatientById(req.params.patientid).then(patient => {
    return res.status(200).json(patient);
  });
}

export async function create(req: Request, res: Response) {
  createPatient(req.body).then(patient => {
    return res.status(201).json(patient);
  });
}

export async function update(req: Request, res: Response) {
  updatePatient(req.params.patientid, req.body).then(patient => {
    res.status(204).json(patient);
  });
}
