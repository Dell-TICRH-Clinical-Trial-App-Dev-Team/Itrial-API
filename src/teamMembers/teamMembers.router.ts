import express from 'express';

import { create, read, update } from '../crud/controller';

import { readByEmail } from './teamMembers.controller';
import { TeamMemberModel } from '../models';
import { updateFunctions } from './teamMembers.service';

const router = express.Router();

router.post('/', create(TeamMemberModel));
router.get('/id/:id', read(TeamMemberModel));
router.put('/id/:id', update(TeamMemberModel, updateFunctions));

router.get('/email/:email', readByEmail);

export { router as teamMemberRouter };
