import { Request, Response } from "express";
import { TeamMember } from "./teamMembers.model";

export async function getTeamMemberById(req: Request, res: Response) {
  TeamMember.findById(req.params.teammemberid).exec((err, teamMember) => {
    res.status(200).json(teamMember);
  });
}

export async function createTeamMember(req: Request, res: Response) {
  const { name, address, email, phone, permissions, trials, sites, cccs } =
    req.body;

  const teamMember = TeamMember.build({
    name,
    address,
    email,
    phone,
    permissions,
    trials,
    sites,
    cccs,
  });

  await teamMember.save();
  return res.status(201).json(teamMember);
}

export async function updateTeamMember(req: Request, res: Response) {
  TeamMember.findByIdAndUpdate(
    req.params.teammemberid,
    req.body,
    (err, result) => {
      res.status(204).json(result);
    }
  );
}
