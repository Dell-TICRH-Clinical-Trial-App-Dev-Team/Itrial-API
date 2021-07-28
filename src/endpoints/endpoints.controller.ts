import { Request, Response } from "express";
import {
  getEndpointById,
  createEndpoint,
  updateEndpoint,
} from "./endpoints.service";

export async function get(req: Request, res: Response) {
  getEndpointById(req.params.endpointid).then(endpoint => {
    return res.status(200).json(endpoint);
  });
}

export async function create(req: Request, res: Response) {
  createEndpoint(req.body).then(endpoint => {
    return res.status(201).json(endpoint);
  });
}

export async function update(req: Request, res: Response) {
  updateEndpoint(req.params.endpointid, req.body).then(endpoint => {
    return res.status(204).json(endpoint);
  });
}
