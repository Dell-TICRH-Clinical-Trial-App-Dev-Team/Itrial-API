import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';
import { router } from '../router';

const server = express();
server.use(morgan('dev'));
server.use(json());

server.get('/', (req: Request, res: Response) => {
  res.send('The API is up!');
});

server.use('/api', router);

export default server;
