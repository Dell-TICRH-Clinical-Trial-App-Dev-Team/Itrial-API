import express from "express";
const router = express.Router();

import {
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
} from "./teamMembers.controller";

router.get("/:teammemberid", getTeamMemberById);
router.put("/:teammemberid", updateTeamMember);
router.post("/", createTeamMember);

export { router as teamMemberRouter };
