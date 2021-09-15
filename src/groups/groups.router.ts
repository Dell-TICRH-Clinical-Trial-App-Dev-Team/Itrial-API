import { router } from '../crud/router';
import { getEdge, getEdges, addOrRemoveEdge } from '../crud/controller';

import {
  GroupModel,
  PatientModel,
  SiteModel,
  TrialModel,
} from '../models';

const groupRouter = router(GroupModel);

groupRouter.get('/id/:id/trial', getEdge(GroupModel, 'site', SiteModel));
groupRouter.get('/id/:id/sites', getEdges(GroupModel, 'trials', TrialModel));
groupRouter.get(
  '/id/:id/patients',
  getEdges(GroupModel, 'patients', PatientModel)
);

groupRouter.put(
  '/id/:id/trial',
  addOrRemoveEdge(false, GroupModel, 'site', false)
);
groupRouter.post(
  '/id/:id/sites',
  addOrRemoveEdge(
    false,
    GroupModel,
    'trials',
    true,
    TrialModel,
    'groups',
    true
  )
);
groupRouter.post(
  '/id/:id/patients',
  addOrRemoveEdge(
    false,
    GroupModel,
    'patients',
    true,
    PatientModel,
    'group',
    false
  )
);

groupRouter.delete(
  '/id/:id/trial',
  addOrRemoveEdge(true, GroupModel, 'site', false)
);
groupRouter.delete(
  '/id/:id/sites',
  addOrRemoveEdge(
    true,
    GroupModel,
    'trials',
    true,
    TrialModel,
    'groups',
    true
  )
);
groupRouter.delete(
  '/id/:id/patients',
  addOrRemoveEdge(
    true,
    GroupModel,
    'patients',
    true,
    PatientModel,
    'group',
    false
  )
);

export { groupRouter };
