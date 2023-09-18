import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { StateController } from './state.controller';
import { StateService } from './state.service';

const router: Router = Router();
const nx = new NxService();
const ds = new StateService(nx);
const ctrl = new StateController(ds);


router.post('/create', ctrl.create);
router.post('/findAll', ctrl.findAll);

export default router;
