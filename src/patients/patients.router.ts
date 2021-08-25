import express from 'express';

import { create, read, update } from '../crud/controller';

import { readByEmail } from './patients.controller';
import { PatientModel } from '../models';
import { updateFunctions } from './patients.service';

const router = express.Router();

router.post('/', create(PatientModel));
router.get('/id/:id', read(PatientModel));
router.put('/id/:id', update(PatientModel, updateFunctions));

router.get('/email/:email', readByEmail);

export { router as patientRouter };
