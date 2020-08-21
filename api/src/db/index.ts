import '../LoadEnv'; // Must be the first import

import app from '@server';
import mongoose from 'mongoose';
import logger from '@shared/Logger';

export default class DBConnector {
  static connectToDB() {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'test') {
        logger.info('Connecting to a mock db for testing purposes.');
        const { MongoMemoryServer } = require('mongodb-memory-server');

        const mongoServer = new MongoMemoryServer();

        mongoose.Promise = Promise;
        mongoServer.getUri().then((mongoUri: string) => {
          const mongooseOpts = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
          };

          mongoose.connect(mongoUri, mongooseOpts);

          mongoose.connection.on('error', (e) => {
            logger.error(e);
            reject();
          });

          mongoose.connection.once('open', () => {
            logger.info(`MongoDB successfully connected to ${mongoUri}`);
            resolve();
          });
        });
      } else {
        const uri: string = process.env.MONGO_CONNECTION_STRING || '';
        logger.info('uri:', uri)
        mongoose
          .connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
          })
          .then(() => {
            logger.info('Connected to MongoDB');
            resolve();
          })
          .catch((err) => {
            logger.error('Something went wrong when connecting to the db', err);
            reject();
          });
      }
    });
  }

  static async close() {
    await mongoose.connection.close()
  }
}
