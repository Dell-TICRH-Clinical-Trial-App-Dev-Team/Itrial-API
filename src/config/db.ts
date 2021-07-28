import mongoose from "mongoose";
import config from "./config";

async function connectToDB() {
  const dbURI = config.mongoUrl;

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
}

export default connectToDB;
