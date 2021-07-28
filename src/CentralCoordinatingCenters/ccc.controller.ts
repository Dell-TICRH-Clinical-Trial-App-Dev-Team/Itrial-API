import { Request, Response } from "express";
import { getCCCById, createCCC, updateCCC } from "./ccc.service";

export async function get(req: Request, res: Response) {
  getCCCById(req.params.cccid).then(ccc => {
    return res.status(200).json(ccc);
  });
}

export async function create(req: Request, res: Response) {
  createCCC(req.body).then(ccc => {
    return res.status(201).json(ccc);
  });
}

export async function update(req: Request, res: Response) {
  updateCCC(req.params.cccid, req.body).then(ccc => {
    res.status(204).json(ccc);
  });
}
