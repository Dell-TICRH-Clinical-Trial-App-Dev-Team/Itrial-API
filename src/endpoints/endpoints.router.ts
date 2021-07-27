import express, { Request, Response } from "express";
const router = express.Router();

import { getEndpointById, createEndpoint } from "./endpoints.controller";

router.get("/:endpointid", getEndpointById);
router.post("/", createEndpoint);

export { router as endpointRouter };
