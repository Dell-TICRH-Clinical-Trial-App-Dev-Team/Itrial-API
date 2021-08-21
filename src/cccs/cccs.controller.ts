import { Request, Response } from 'express';
import { getCccById, createCcc, updateCcc } from './cccs.service';

export async function get(req: Request, res: Response) {
  getCccById(req.params.cccid)
    .then((ccc) => {
      return res.status(200).json(ccc);
    })
    .catch((err) => {
      return res.status(err.status).json({ error: err.message });
    });
}

export async function create(req: Request, res: Response) {
  createCcc(req.body)
    .then((ccc) => {
      return res.status(201).json(ccc);
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message });
    });
}

export async function update(req: Request, res: Response) {
  updateCcc(req.params.cccid, req.body.operation, req.body.payload)
    .then((ccc) => {
      res.status(204).json(ccc);
    })
    .catch((err) => {
      return res.status(err.status).json({ error: err.message });
    });
}
