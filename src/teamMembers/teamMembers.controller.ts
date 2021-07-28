import { Request, Response } from "express";
import {
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
} from "./teamMembers.service";

export async function get(req: Request, res: Response) {
  getTeamMemberById(req.params.teammemberid).then(teamMember => {
    return res.status(200).json(teamMember);
  });
}

export async function create(req: Request, res: Response) {
  createTeamMember(req.body).then(teamMember => {
    return res.status(201).json(teamMember);
  });
}

export async function update(req: Request, res: Response) {
  updateTeamMember(req.params.teammemberid, req.body).then(teamMember => {
    return res.status(204).json(teamMember);
  });
}
