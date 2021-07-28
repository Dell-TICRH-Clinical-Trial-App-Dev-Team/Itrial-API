import createServer from "./config/server";
import connectToDB from "./config/db";
import config from "./config/config";

connectToDB().then(() =>
  createServer().then(server => {
    server.listen(config.port, () => {
      console.log("Listening on http://localhost:" + config.port);
    });
  })
);
