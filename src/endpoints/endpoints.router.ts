import { router } from '../crud/router';
import { getEdge, addOrRemoveEdge } from '../crud/controller';

import {
  EndpointModel,
  GroupModel,
  PatientModel,
  SiteModel,
  TrialModel,
} from '../models';

const endpointRouter = router(EndpointModel);

endpointRouter.get('/id/:id/site', getEdge(EndpointModel, 'site', SiteModel));
endpointRouter.get(
  '/id/:id/trial',
  getEdge(EndpointModel, 'trial', TrialModel)
);
endpointRouter.get(
  '/id/:id/group',
  getEdge(EndpointModel, 'group', GroupModel)
);
endpointRouter.get(
  '/id/:id/patient',
  getEdge(EndpointModel, 'patient', PatientModel)
);

endpointRouter.put(
  '/id/:id/site',
  addOrRemoveEdge(false, EndpointModel, 'site', false)
);
endpointRouter.put(
  '/id/:id/trial',
  addOrRemoveEdge(false, EndpointModel, 'trial', false)
);
endpointRouter.put(
  '/id/:id/group',
  addOrRemoveEdge(false, EndpointModel, 'group', false)
);
endpointRouter.put(
  '/id/:id/patient',
  addOrRemoveEdge(
    false,
    EndpointModel,
    'patient',
    false,
    PatientModel,
    'endpoints',
    true
  )
);

export { endpointRouter };
