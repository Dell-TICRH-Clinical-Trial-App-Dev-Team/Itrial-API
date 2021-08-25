import server from './config/server';
import { connectToDB } from './config/db';
import config from './config/config';

async function main() {
  await connectToDB();
  server.listen(config.port, () => {
    console.log('Listening on http://0.0.0.0:' + config.port);
  });
}

main();
