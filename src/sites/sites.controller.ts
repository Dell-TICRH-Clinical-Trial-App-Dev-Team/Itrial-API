import { Request, Response } from "express";
import { getSiteById, createSite, updateSite } from "./sites.service";

export async function get(req: Request, res: Response) {
  getSiteById(req.params.siteid).then(site => {
    return res.status(200).json(site);
  });
}

export async function create(req: Request, res: Response) {
  createSite(req.body).then(site => {
    return res.status(201).json(site);
  });
}

export async function update(req: Request, res: Response) {
  updateSite(req.params.siteid, req.body).then(site => {
    res.status(204).json(site);
  });
}
