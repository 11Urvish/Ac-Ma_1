import { Router } from 'express';
import { NxService } from '../../shared/nx-library/nx-service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

const router: Router = Router();
const nx = new NxService();
const ds = new TransactionService(nx);
const ctrl = new TransactionController(ds);

// router.get('/findById', ctrl.findById);
// router.post('/findAll', ctrl.findAll);
router.post('/findByLoanId', ctrl.findByLoanId);
router.post('/findWithdrawInterestByLoanId', ctrl.findWithdrawInterestByLoanId);
router.post('/create', ctrl.create);
router.post('/createDeposite', ctrl.createDeposite);
router.post('/createWithdraw', ctrl.createWithdraw);
router.post('/findWeeklyReport', ctrl.findWeeklyReport);
// router.post('/update', ctrl.update);
// router.post('/delete', ctrl.delete);

export default router;
