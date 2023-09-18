import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { CityController } from './city.controller';
import { CityService } from './city.service';

const router: Router = Router();
const nx = new NxService();
const ds = new CityService(nx);
const ctrl = new CityController(ds);

router.get('/findById', ctrl.findById);
router.post('/findAll', ctrl.findAll);
router.post('/create', ctrl.create);
router.post('/update', ctrl.update);
router.post('/delete', ctrl.delete);

export default router;
