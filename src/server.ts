import config from "./config/config";
import express, { Request, Response } from "express";
import { json } from "body-parser";
import morgan from "morgan";

import connect from "./config/db";
import { router } from "./router";

const app = express();
app.use(morgan("dev"));
app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("The API is up!");
});

app.use("/api", router);

const port = config.port;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);

  connect();
});
