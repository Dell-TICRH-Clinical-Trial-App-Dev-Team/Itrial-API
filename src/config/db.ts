const cccModel = import("../CentralCoordinatingCenters/ccc.model");

import mongoose from "mongoose";
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/itrial";

mongoose.set("useCreateIndex", true);
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on("error", err => {
  console.log(`Mongoose connection error: ${err}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
