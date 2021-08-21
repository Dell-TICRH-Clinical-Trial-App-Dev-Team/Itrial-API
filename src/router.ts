import express from 'express';
const router = express.Router();

import { cccRouter } from './cccs/cccs.router';
import { trialRouter } from './trials/trials.router';
import { endpointRouter } from './endpoints/endpoints.router';
import { patientRouter } from './patients/patients.router';
import { siteRouter } from './sites/sites.router';
import { teamMemberRouter } from './teamMembers/teamMembers.router';

router.use('/cccs', cccRouter);
router.use('/trials', trialRouter);
router.use('/endpoints', endpointRouter);
router.use('/patients', patientRouter);
router.use('/sites', siteRouter);
router.use('/team-members', teamMemberRouter);

export { router as router };
