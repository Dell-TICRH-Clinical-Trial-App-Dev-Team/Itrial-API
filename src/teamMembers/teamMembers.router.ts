import express from "express";
const router = express.Router();

import { get, create, update } from "./teamMembers.controller";

router.get("/:teammemberid", get);
router.put("/:teammemberid", update);
router.post("/", create);

export { router as teamMemberRouter };
