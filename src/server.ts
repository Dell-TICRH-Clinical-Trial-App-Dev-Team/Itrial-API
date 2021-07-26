import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { json } from "body-parser";

import connect from "./config/db";
import { router } from "./router";

const app = express();
app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);

  connect();
});
