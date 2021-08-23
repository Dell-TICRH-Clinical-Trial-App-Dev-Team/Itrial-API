import express from 'express';
const router = express.Router();

import { getById, getByEmail, create, update } from './teamMembers.controller';

router.get('/id/:teammemberid', getById);
router.get('/email/:teammemberemail', getByEmail);
router.put('/id/:teammemberid', update);
router.post('/', create);

export { router as teamMemberRouter };
