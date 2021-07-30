import { Request, Response } from 'express';
import { getTrialById, createTrial, updateTrial } from './trials.service';

export async function get(req: Request, res: Response) {
  getTrialById(req.params.trialid)
    .then((trial) => {
      return res.status(200).json(trial);
    })
    .catch((err) => {
      return res.status(err.status).json({ error: err.message });
    });
}

export async function create(req: Request, res: Response) {
  createTrial(req.body)
    .then((trial) => {
      return res.status(201).json(trial);
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message });
    });
}

export async function update(req: Request, res: Response) {
  updateTrial(req.params.trialid, req.body.operation, req.body.payload)
    .then((trial) => {
      res.status(204).json(trial);
    })
    .catch((err) => {
      return res.status(err.status).json({ error: err.message });
    });
}
