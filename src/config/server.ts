import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';
import { router } from '../router';
import passport from 'passport';
import { LocalStrategy } from 'passport-local-mongoose';

const server = express();
server.use(morgan('dev'));
server.use(json());

server.get('/', (req: Request, res: Response) => {
  res.send('The API is up!');
});

server.use('/api', router);

import { Patient } from '../patients/patients.model';
passport.use(new LocalStrategy(Patient.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());

export default server;
