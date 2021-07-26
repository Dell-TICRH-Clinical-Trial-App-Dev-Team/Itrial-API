import express, { Request, Response } from "express";
const router = express.Router();

import { cccRouter } from "./centralCoordinatingCenters/ccc.router";

router.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
router.use("/ccc", cccRouter);

export { router as router };
