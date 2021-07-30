import express from 'express';
const router = express.Router();

import { get, update, create } from './patients.controller';

router.get('/:patientid', get);
router.put('/:patientid', update);
router.post('/', create);

export { router as patientRouter };
