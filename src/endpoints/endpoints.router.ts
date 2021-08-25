import { router } from '../crud/router';

import { EndpointModel } from '../models';
import { updateFunctions } from './endpoints.service';

const endpointRouter = router(EndpointModel, updateFunctions);

export { endpointRouter };
