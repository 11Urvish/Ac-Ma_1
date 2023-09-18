import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

const router: Router = Router();
const nx = new NxService();
const ds = new ReportService(nx);
const ctrl = new ReportController(ds);

router.post('/findTransactionReport', ctrl.findTransactionReport);
router.post('/findInterestReport', ctrl.findInterestReport);

export default router;
