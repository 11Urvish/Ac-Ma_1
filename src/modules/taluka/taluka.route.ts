import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { TalukaController } from './taluka.controller';
import { TalukaService } from './taluka.service';

const router: Router = Router();
const nx = new NxService();
const ds = new TalukaService(nx);
const ctrl = new TalukaController(ds);


router.post('/create', ctrl.create);
router.post('/findAll', ctrl.findAll);

export default router;
