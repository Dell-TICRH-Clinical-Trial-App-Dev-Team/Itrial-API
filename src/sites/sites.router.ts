import { router } from '../crud/router';

import { SiteModel } from '../models';
import { updateFunctions } from './sites.service';

const siteRouter = router(SiteModel, updateFunctions);

export { siteRouter };
