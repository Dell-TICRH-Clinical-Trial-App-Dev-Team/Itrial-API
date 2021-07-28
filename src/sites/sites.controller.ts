import { Request, Response } from "express";
import { Site } from "./sites.model";

export async function getSiteById(req: Request, res: Response) {
  Site.findById(req.params.siteid).exec((err, site) => {
    res.status(200).json(site);
  });
}

export async function createSite(req: Request, res: Response) {
  const { name, address, trials, teamMembers, cccs } = req.body;

  const site = Site.build({
    name,
    address,
    trials,
    teamMembers,
    cccs,
  });

  await site.save();
  return res.status(201).json(site);
}

export async function updateSite(req: Request, res: Response) {
  Site.findByIdAndUpdate(req.params.siteid, req.body, (err, result) => {
    res.status(204).json(result);
  });
}
