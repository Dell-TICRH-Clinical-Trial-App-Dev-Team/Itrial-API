import { router } from '../crud/router';

import { CccModel } from '../models';
import { updateFunctions } from './cccs.service';

const cccRouter = router(CccModel, updateFunctions);

export { cccRouter };
