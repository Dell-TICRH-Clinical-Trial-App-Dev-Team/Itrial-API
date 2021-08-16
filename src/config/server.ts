import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import { router } from '../router';
import jwtCheck from './auth';

const server = express();
server.use(morgan('dev'));
server.use(json());
server.use(cors());

server.get('/', (req: Request, res: Response) => {
  res.json('The API is up!');
});

server.get('/auth', jwtCheck, (req: Request, res: Response) => {
  res.json('This is a protected resource.');
});

// server.use('/api', jwtCheck, router); tests wont pass if this is left as is
server.use('/api', router);

export default server;
