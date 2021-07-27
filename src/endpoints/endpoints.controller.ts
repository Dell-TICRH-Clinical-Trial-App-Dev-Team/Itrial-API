import { Request, Response } from "express";
import { Endpoint } from "./endpoints.model";

export async function getEndpointById(req: Request, res: Response) {
  Endpoint.findById(req.params.endpointid).exec((err, ccc) => {
    res.status(200).json(ccc);
  });
}

export async function createEndpoint(req: Request, res: Response) {
  const {
    name,
    date,
    description,
    score,
    documents,
    teamMembers,
    groups,
    patients,
  } = req.body;

  const endpoint = Endpoint.build({
    name,
    date,
    description,
    score,
    documents,
    teamMembers,
    groups,
    patients,
  });

  await endpoint.save();
  return res.status(201).json(endpoint);
}
