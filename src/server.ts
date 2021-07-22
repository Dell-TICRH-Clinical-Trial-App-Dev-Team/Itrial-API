import * as dotenv from "dotenv";
dotenv.config();

import * as db from "./config/db";

import express from "express";
import { router } from "./router";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req: any, res: any) => {
  res.send("Hello, World!");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
