import { Request, Response } from 'express';
import {
  getEndpointById,
  createEndpoint,
  updateEndpoint,
} from './endpoints.service';

export async function get(req: Request, res: Response) {
  getEndpointById(req.params.endpointid)
    .then((endpoint) => {
      return res.status(200).json(endpoint);
    })
    .catch((err) => {
      return res.status(err.status).json({ error: err.message });
    });
}

export async function create(req: Request, res: Response) {
  createEndpoint(req.body)
    .then((endpoint) => {
      return res.status(201).json(endpoint);
    })
    .catch((err) => {
      console.log('create', err);
      return res.status(400).json({ error: err.message });
    });
}

export async function update(req: Request, res: Response) {
  updateEndpoint(req.params.endpointid, req.body.operation, req.body.payload)
    .then((endpoint) => {
      res.status(204).json(endpoint);
    })
    .catch((err) => {
      console.log('update', err);
      return res.status(err.status).json({ error: err.message });
    });
}
