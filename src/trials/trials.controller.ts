import { Request, Response } from "express";
import { createTrial, updateTrial, getTrialById } from "./trials.service";

export async function get(req: Request, res: Response) {
  getTrialById(req.params.trialid).then(trial => {
    return res.status(200).json(trial);
  });
}

export async function create(req: Request, res: Response) {
  createTrial(req.body).then(trial => {
    return res.status(201).json(trial);
  });
}

export async function update(req: Request, res: Response) {
  updateTrial(req.params.trialid, req.body).then(trial => {
    res.status(204).json(trial);
  });
}
