import { Request, Response } from "express";
import { getSiteById, createSite, updateSite } from "./sites.service";

export async function get(req: Request, res: Response) {
  getSiteById(req.params.siteid)
    .then(site => {
      return res.status(200).json(site);
    })
    .catch(err => {
      return res.status(err.status).json({ error: err.message });
    });
}

export async function create(req: Request, res: Response) {
  createSite(req.body)
    .then(site => {
      return res.status(201).json(site);
    })
    .catch(err => {
      return res.status(400).json({ error: err.message });
    });
}

export async function update(req: Request, res: Response) {
  updateSite(req.params.siteid, req.body.operation, req.body.payload)
    .then(site => {
      res.status(204).json(site);
    })
    .catch(err => {
      return res.status(err.status).json({ error: err.message });
    });
}
