import express, { Router } from 'express';

import { Model } from '../utils/utils';
import { getDoc, setDoc, createDoc, removeDoc } from './controller';

export function router(model: Model<any>): Router {
  const router = express.Router();

  router.post('/', ...createDoc(model));
  router.get('/id/:id', ...getDoc(model));
  router.put('/id/:id', ...setDoc(model));
  router.delete('/id/:id', ...removeDoc(model));

  return router;
}
