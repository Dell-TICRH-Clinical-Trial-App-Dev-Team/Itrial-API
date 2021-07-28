import express, { Request, Response } from "express";
const router = express.Router();

import {
  getEndpointById,
  createEndpoint,
  updateEndpoint,
} from "./endpoints.controller";

router.get("/:endpointid", getEndpointById);
router.put("/:endpointid", updateEndpoint);
router.post("/", createEndpoint);

export { router as endpointRouter };
