import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import { ClientError } from '../utils/utils';
import { router } from '../router';
import jwtCheck from './auth';
import config from './config';

const server = express();
server.use(morgan('dev'));
server.use(json());
server.use(cors());

server.get('/', (req: Request, res: Response) => {
  res.json('The API is up!');
});

server.get('/auth', jwtCheck, (req: Request, res: Response) => {
  res.json(`This is a protected resource. Hello, ${req.query.email}.`);
});

if (!config.isTesting) server.use('/api', jwtCheck, router);
else server.use('/api', router);

server.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof ClientError) {
    res.status(err.status).send({ errors: err.errors });
  } else {
    next(err);
  }
});

export default server;
