import { router } from '../crud/router';
import { getEdge, getEdges, addOrRemoveEdge } from '../crud/controller';

import {
  EndpointModel,
  GroupModel,
  PatientModel,
  SiteModel,
  TrialModel,
} from '../models';

const patientRouter = router(PatientModel);

patientRouter.get('/id/:id/group', getEdge(PatientModel, 'group', GroupModel));
patientRouter.get('/id/:id/site', getEdge(PatientModel, 'site', SiteModel));
patientRouter.get('/id/:id/trial', getEdge(PatientModel, 'trial', TrialModel));
patientRouter.get('/id/:id/endpoints', getEdges(PatientModel, 'endpoints', EndpointModel));

patientRouter.put('/id/:id/group', addOrRemoveEdge(false, PatientModel, 'group', false, GroupModel, 'patients', true));
patientRouter.put('/id/:id/site', addOrRemoveEdge(false, PatientModel, 'site', false));
patientRouter.put('/id/:id/trial', addOrRemoveEdge(false, PatientModel, 'trial', false, TrialModel, 'patients', true));
patientRouter.post('/id/:id/endpoints', addOrRemoveEdge(false, PatientModel, 'endpoints', true, EndpointModel, 'patient', false));



export { patientRouter as groupRouter };
