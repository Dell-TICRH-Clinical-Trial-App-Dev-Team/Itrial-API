import { router } from '../crud/router';

import { TrialModel } from '../models';
import { updateFunctions } from './trials.service';

const trialRouter = router(TrialModel, updateFunctions);

export { trialRouter };
