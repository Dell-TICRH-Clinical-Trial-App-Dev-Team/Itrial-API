import express from 'express';
const router = express.Router();

import { get, create, update } from './endpoints.controller';

router.get('/:endpointid', get);
router.put('/:endpointid', update);
router.post('/', create);

export { router as endpointRouter };
