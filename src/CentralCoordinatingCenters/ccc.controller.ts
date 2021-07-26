import { Request, Response } from "express";
import { CentralCoordinatingCenter } from "./ccc.model";

export async function getCCCById(req: Request, res: Response) {
  CentralCoordinatingCenter.findById(req.params.cccid).exec((err, ccc) => {
    res.status(200).json(ccc);
  });
}

export async function createCCC(req: Request, res: Response) {
  const { name, sites, trials, teamMembers } = req.body;

  const ccc = CentralCoordinatingCenter.build({
    name,
    sites,
    trials,
    teamMembers,
  });

  await ccc.save();
  return res.status(201).json(ccc);
}
