import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { FirmController } from './firm.controller';
import { FirmService } from './firm.service';

const router: Router = Router();
const nx = new NxService();
const ds = new FirmService(nx);
const ctrl = new FirmController(ds);

router.get('/findById', ctrl.findById);
router.get('/findByValue', ctrl.findByValue);
router.post('/findAll', ctrl.findAll);
router.post('/create', ctrl.create);
router.post('/update', ctrl.update);
router.post('/delete', ctrl.delete);

export default router;
