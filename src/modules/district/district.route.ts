import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

const router: Router = Router();
const nx = new NxService();
const ds = new DistrictService(nx);
const ctrl = new DistrictController(ds);


router.post('/create', ctrl.create);
router.post('/findAll', ctrl.findAll);
router.post('/findByStateId', ctrl.findByStateId);

export default router;
