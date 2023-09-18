import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { LoanTransferController } from './loan-transfer.controller';
import { LoanTransferService } from './loan-transfer.service';

const router: Router = Router();
const nx = new NxService();
const ds = new LoanTransferService(nx);
const ctrl = new LoanTransferController(ds);

router.get('/findById', ctrl.findById);
router.post('/findAll', ctrl.findAll);
router.post('/findBundleId', ctrl.findBundleId);
router.post('/create', ctrl.create);
router.post('/update', ctrl.update);
router.post('/delete', ctrl.delete);

export default router;
