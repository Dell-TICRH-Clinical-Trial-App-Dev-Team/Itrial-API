import express from 'express';

import { create, read, update } from '../crud/controller';

import { readByEmail } from './cccs.controller';
import { CccModel } from '../models';
import { updateFunctions } from './cccs.service';

const router = express.Router();

router.post('/', create(CccModel));
router.get('/id/:id', read(CccModel));
router.put('/id/:id', update(CccModel, updateFunctions));

router.get('/email/:email', readByEmail);

export { router as cccRouter };
