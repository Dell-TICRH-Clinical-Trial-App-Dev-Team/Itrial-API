import express from 'express';
const router = express.Router();

import { get, create, update } from './ccc.controller';

router.get('/:cccid', get);
router.put('/:cccid', update);
router.post('/', create);

export { router as cccRouter };
