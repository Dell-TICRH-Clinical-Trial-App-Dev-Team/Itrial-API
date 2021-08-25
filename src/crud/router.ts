import express, { Router } from 'express';

import { CrudModel, UpdateFunctions } from '../utils/utils';
import { create, read, update } from './controller';

export function router<T>(model: CrudModel<T>, 
  updateFunctions: UpdateFunctions<T>): Router {

  const router = express.Router();

  router.post('/', create(model));
  router.get('/:id', read(model));
  router.put('/:id', update(model, updateFunctions));

  return router;
}
