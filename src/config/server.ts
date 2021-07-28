import express, { Request, Response } from "express";
import { json } from "body-parser";
import morgan from "morgan";
import { router } from "../router";

async function createServer() {
  const server = express();
  server.use(morgan("dev"));
  server.use(json());

  server.get("/", (req: Request, res: Response) => {
    res.send("The API is up!");
  });

  server.use("/api", router);

  return server;
}

export default createServer;
