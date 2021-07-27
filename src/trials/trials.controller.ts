import { Request, Response } from "express";
import { Trial } from "./trials.model";

export async function getTrialById(req: Request, res: Response) {
  Trial.findById(req.params.trialid).exec((err, ccc) => {
    res.status(200).json(ccc);
  });
}

export async function createTrial(req: Request, res: Response) {
  const {
    name,
    endpointResults,
    protocols,
    permissions,
    blinded,
    sites,
    teamMembers,
    groups,
    patients,
  } = req.body;

  const trial = Trial.build({
    name,
    endpointResults,
    protocols,
    permissions,
    blinded,
    sites,
    teamMembers,
    groups,
    patients,
  });

  await trial.save();
  return res.status(201).json(trial);
}
