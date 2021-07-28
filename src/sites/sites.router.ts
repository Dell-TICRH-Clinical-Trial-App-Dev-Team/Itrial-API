import express from "express";
const router = express.Router();

import { get, create, update } from "./sites.controller";

router.get("/:siteid", get);
router.put("/:siteid", update);
router.post("/", create);

export { router as siteRouter };
