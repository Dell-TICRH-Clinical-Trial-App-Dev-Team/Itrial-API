import mongoose from 'mongoose';
import config from './config';

async function connectToDB(testUri?: string) {
  const dbURI = testUri
    ? `mongodb://localhost:27017/${testUri}`
    : config.mongoUrl;

  mongoose.set('useCreateIndex', true);
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    if (!config.isTesting) console.log(`Mongoose connected to ${dbURI}`);
  });
  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
  });
  mongoose.connection.on('disconnected', () => {
    if (!config.isTesting) console.log(`Mongoose disconnected from ${dbURI}`);
  });
}

async function dropDB() {
  mongoose.connection.db.dropDatabase(() => mongoose.connection.close());
}

export { connectToDB, dropDB };
