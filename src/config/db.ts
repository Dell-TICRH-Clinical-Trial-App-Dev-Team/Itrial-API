import mongoose from 'mongoose';
import config from './config';

async function connectToDB(testUri?: string) {
  const dbURI = `mongodb://localhost:27017/${testUri}` || config.mongoUrl;

  mongoose.set('useCreateIndex', true);
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    // console.log(`Mongoose connected to ${dbURI}`);
  });
  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
  });
  mongoose.connection.on('disconnected', () => {
    // console.log("Mongoose disconnected");
  });
}

async function dropDB() {
  mongoose.connection.db.dropDatabase(() => mongoose.connection.close());
}

export { connectToDB, dropDB };
