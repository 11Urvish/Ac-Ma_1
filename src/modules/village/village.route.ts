import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

const router: Router = Router();
const nx = new NxService();
const ds = new VillageService(nx);
const ctrl = new VillageController(ds);


router.post('/create', ctrl.create);
router.post('/findAll', ctrl.findAll);

export default router;
