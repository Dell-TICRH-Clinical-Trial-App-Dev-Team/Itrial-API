import express from 'express';
const router = express.Router();

import { getById, getByEmail, update, create } from './patients.controller';

router.get('/id/:patientid', getById);
router.get('/email/:patientemail', getByEmail);
router.put('/id/:patientid', update);
router.post('/', create);

export { router as patientRouter };
