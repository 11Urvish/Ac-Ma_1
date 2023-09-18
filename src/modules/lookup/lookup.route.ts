import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';

import { LookupController } from './lookup.controller';
import { LookupService } from './lookup.service';

const router: Router = Router();
const nx = new NxService();
const ds = new LookupService(nx);
const ctrl = new LookupController(ds);

router.post('/find', ctrl.find);
router.post('/findStatesByCountryId', ctrl.findStatesByCountryId);

export default router;