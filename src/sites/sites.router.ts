import express from "express";
const router = express.Router();

import { getSiteById, createSite, updateSite } from "./sites.controller";

router.get("/:siteid", getSiteById);
router.put("/:siteid", updateSite);
router.post("/", createSite);

export { router as siteRouter };
