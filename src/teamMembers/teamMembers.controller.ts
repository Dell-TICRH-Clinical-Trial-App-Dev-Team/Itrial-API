import { Request, Response } from "express";
import {
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
} from "./teamMembers.service";

export async function get(req: Request, res: Response) {
  getTeamMemberById(req.params.teamMemberid)
    .then(teamMember => {
      return res.status(200).json(teamMember);
    })
    .catch(err => {
      return res.status(err.status).json({ error: err.message });
    });
}

export async function create(req: Request, res: Response) {
  createTeamMember(req.body)
    .then(teamMember => {
      return res.status(201).json(teamMember);
    })
    .catch(err => {
      return res.status(400).json({ error: err.message });
    });
}

export async function update(req: Request, res: Response) {
  updateTeamMember(
    req.params.teamMemberid,
    req.body.operation,
    req.body.payload
  )
    .then(teamMember => {
      res.status(204).json(teamMember);
    })
    .catch(err => {
      return res.status(err.status).json({ error: err.message });
    });
}
